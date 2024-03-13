package com.algolovers.newsletterconsole.newsletter.engine;

import com.algolovers.newsletterconsole.data.entity.reponse.QuestionResponse;
import com.algolovers.newsletterconsole.data.entity.reponse.ResponseData;
import com.algolovers.newsletterconsole.newsletter.engine.data.PDFData;
import com.algolovers.newsletterconsole.newsletter.engine.data.PDFElement;
import com.algolovers.newsletterconsole.newsletter.engine.data.Type;
import com.algolovers.newsletterconsole.service.GoogleDriveService;
import lombok.AllArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Tag;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class NewsletterEngine {

    private final GoogleDriveService googleDriveService;

    private static final Function<String, String> pdfFolder = (groupId) -> String.format("%s-issues", groupId);
    private static final Function<String, String> sanitizeGroupName = (groupName) -> groupName.replaceAll("[^a-zA-Z0-9-_]", "_");
    private static final Function<String, String> fileName = (groupName) -> {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM-yyyy", Locale.getDefault());
        String currentMonthYear = dateFormat.format(new Date());
        String sanitizedGroupName = sanitizeGroupName.apply(groupName);
        return String.format("%s-issue-%s", sanitizedGroupName, currentMonthYear);
    };

    private String htmlToXhtml(File template, PDFData pdfData) throws IOException {
        Document document = Jsoup.parse(template);

        Objects.requireNonNull(document.getElementById("date")).text("Issue: " + pdfData.getDateOfGeneration());
        Objects.requireNonNull(document.getElementById("title")).text("Newsletter");
        Objects.requireNonNull(document.getElementById("issue-name")).text(pdfData.getGroupTitle());
        Objects.requireNonNull(document.getElementById("group-description")).text(pdfData.getGroupDescription());

        Element container = document.getElementsByClass("container").first();

        pdfData.getPdfElementList().forEach(pdfElement -> Objects.requireNonNull(container).appendChild(buildElementForContent(pdfElement)));

        document.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
        return document.html();
    }

    private String xhtmlToPdfAndUpload(String xhtml, String groupId, String groupName) throws IOException {
        ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
        ITextRenderer iTextRenderer = new ITextRenderer();
        iTextRenderer.setDocumentFromString(xhtml);
        iTextRenderer.layout();
        iTextRenderer.createPDF(byteArray);
        byteArray.close();

        googleDriveService.deleteFolderByName(groupId);
        return googleDriveService.uploadFile(pdfFolder.apply(groupId), fileName.apply(groupName), "application/pdf", byteArray.toByteArray()).getWebViewLink();
    }

    private Element buildElementForContent(PDFElement pdfElement) {
        Element item = new Element(Tag.valueOf("div"), "").addClass("item");

        // Create a div for the profile picture or fallback background
        Element profilePictureContainer = new Element(Tag.valueOf("div"), "").addClass("profile-picture-container");
        Element profilePicture = new Element("div").addClass("profile-picture");

        if (pdfElement.getProfilePicture() != null && !pdfElement.getProfilePicture().isEmpty()) {
            profilePicture.attr("style", "background-image: url('" + pdfElement.getProfilePicture() + "')");
        } else {
            String baseUrl = String.format("https://ui-avatars.com/api/?name=%s&background=random&size=128", pdfElement.getUserName());
            profilePicture.attr("style", "background-image: url('" + baseUrl  + "')");
        }

        // Append the profile picture to its container
        profilePictureContainer.appendChild(profilePicture);

        // Append the profile picture container to the item
        item.appendChild(profilePictureContainer);

        // Create a div to contain both question and response-title
        Element questionAndTitleContainer = new Element(Tag.valueOf("div"), "").addClass("question-and-title-container");

        Element question = new Element(Tag.valueOf("div"), "").addClass("question").text(pdfElement.getQuestion());
        Element responseTitle = new Element(Tag.valueOf("div"), "").addClass("response-title").text(String.format("%s's response:", pdfElement.getUserName()));

        // Append question and response-title to the container
        questionAndTitleContainer.appendChild(question);
        questionAndTitleContainer.appendChild(responseTitle);

        // Append the container to the item

        Element response;

        if (pdfElement.getType().equals(Type.IMAGE)) {
            response = new Element(Tag.valueOf("div"), "").addClass("response-image");
            Element img = new Element("img").addClass("img").attr("src", pdfElement.getResponse());
            response.appendChild(img);
        } else {
            response = new Element(Tag.valueOf("div"), "").addClass("response");
            response.text(pdfElement.getResponse());
        }

        // Append the response to the item
        questionAndTitleContainer.appendChild(response);
        item.appendChild(questionAndTitleContainer);

        return item;
    }



    private PDFData buildDataFromJSON(List<ResponseData> questionResponses) {
        PDFData pdfData = new PDFData();

        List<PDFElement> pdfElementList = questionResponses.stream()
                .map(questionResponse -> questionResponse
                        .getQuestionResponses()
                        .stream()
                        .map(questionResponseData -> PDFElement.builder()
                                .question(questionResponseData.getQuestion())
                                .userName(questionResponse.getUserName())
                                .profilePicture(questionResponse.getUserProfilePicture())
                                .response(getAnswerStringForResponse(questionResponseData, questionResponse.getUserName()))
                                .type(questionResponseData.getQuestionType().getType())
                                .build()).collect(Collectors.toSet()))
                .flatMap(Collection::stream)
                .collect(Collectors.toList());

        Collections.shuffle(pdfElementList, new Random(System.currentTimeMillis()));

        pdfData.setPdfElementList(pdfElementList);
        return pdfData;
    }

    private String getAnswerStringForResponse(QuestionResponse questionResponse, String userName) {
        return switch (questionResponse.getQuestionType()) {
            case TEXT, DROPDOWN -> String.format("%s says: %s", userName, questionResponse.getAnswer());
            case IMAGE -> questionResponse.getAnswer();
            case DATE -> String.format("%s chose the following date: %s", userName, questionResponse.getAnswer());
            case TIME -> String.format("%s chose the following time: %s", userName, questionResponse.getAnswer());
            case CHECKBOX ->
                    String.format("%s chose the following options: %s", userName, flattenArrayToString(questionResponse.getAnswer()));
        };
    }

    private String flattenArrayToString(String jsonArray) {
        try {
            JSONArray array = new JSONArray(jsonArray);
            int length = array.length();

            if (length == 0) {
                return "";
            } else if (length == 1) {
                return array.getString(0);
            } else if (length == 2) {
                return array.getString(0) + " & " + array.getString(1);
            } else {
                StringBuilder stringBuilder = new StringBuilder();
                for (int i = 0; i < length - 2; i++) {
                    stringBuilder.append(array.getString(i)).append(", ");
                }
                stringBuilder.append(array.getString(length - 2)).append(" & ").append(array.getString(length - 1));
                return stringBuilder.toString();
            }
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    //TODO: Add question options, profile picture to response
    public String generateNewsletter(String groupId, String groupName, String groupDescription, List<ResponseData> questionResponses) throws IOException {
        PDFData pdfData = buildDataFromJSON(questionResponses);

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yy");
        pdfData.setDateOfGeneration(dateFormat.format(new Date()));
        pdfData.setGroupTitle(groupName);
        pdfData.setGroupDescription(groupDescription);

        String xhtml = htmlToXhtml(new File("src/main/resources/index.html"), pdfData);
        return xhtmlToPdfAndUpload(xhtml, groupId, groupName);

    }
}
