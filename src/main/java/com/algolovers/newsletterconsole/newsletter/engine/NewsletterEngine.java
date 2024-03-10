package com.algolovers.newsletterconsole.newsletter.engine;

import com.algolovers.newsletterconsole.newsletter.engine.data.PDFData;
import com.algolovers.newsletterconsole.newsletter.engine.data.PDFElement;
import com.algolovers.newsletterconsole.newsletter.engine.data.Type;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Tag;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Objects;

@Service
public class NewsletterEngine {

    private static String htmlToXhtml(File template, PDFData pdfData) throws IOException {
        Document document = Jsoup.parse(template);

        Objects.requireNonNull(document.getElementById("date")).text(pdfData.getDateOfGeneration());
        Objects.requireNonNull(document.getElementById("title")).text("Newsletter");
        Objects.requireNonNull(document.getElementById("issue-name")).text(pdfData.getGroupTitle());
        Objects.requireNonNull(document.getElementById("group-description")).text(pdfData.getGroupDescription());

        Element container = document.getElementsByClass("container").first();

        pdfData.getPdfElementList().forEach(pdfElement -> Objects.requireNonNull(container).appendChild(buildElementForContent(pdfElement)));

        document.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
        return document.html();
    }

    private static void xhtmlToPdf(String xhtml, String outFileName) throws IOException {
        File output = new File(outFileName);
        ITextRenderer iTextRenderer = new ITextRenderer();
        iTextRenderer.setDocumentFromString(xhtml);
        iTextRenderer.layout();
        OutputStream os = new FileOutputStream(output);
        iTextRenderer.createPDF(os);
        os.close();
    }

    private static Element buildElementForContent(PDFElement pdfElement) {

        Element item = new Element(Tag.valueOf("div"), "").addClass("item");
        Element question = new Element(Tag.valueOf("div"), "").addClass("question").text(pdfElement.getQuestion());
        Element responseTitle = new Element(Tag.valueOf("div"), "").addClass("response-title").text(String.format("%s's response:", pdfElement.getUserName()));
        Element response;

        if (pdfElement.getType().equals(Type.IMAGE)) {
            response = new Element(Tag.valueOf("div"), "").addClass("response-image");
            Element img = new Element("img").attr("src", pdfElement.getResponse());
            response.appendChild(img);
        } else {
            response = new Element(Tag.valueOf("div"), "").addClass("response");
            response.text(pdfElement.getResponse());
        }

        item.appendChild(question);
        item.appendChild(responseTitle);
        item.appendChild(response);

        return item;
    }

    private PDFData buildDataFromJSON(String json) {
        //TODO: implement JSON parser

        return new PDFData();
    }
}
