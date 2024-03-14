package com.algolovers.newsletterconsole.service.data;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.groups.GroupMember;
import com.algolovers.newsletterconsole.data.entity.questions.Question;
import com.algolovers.newsletterconsole.data.entity.reponse.QuestionResponse;
import com.algolovers.newsletterconsole.data.entity.reponse.ResponseData;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.enums.QuestionType;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.group.GroupRequest;
import com.algolovers.newsletterconsole.data.model.api.request.question.GroupQuestionsRequest;
import com.algolovers.newsletterconsole.data.model.api.response.questions.FormDataResponse;
import com.algolovers.newsletterconsole.data.model.api.response.questions.FormQuestionResponse;
import com.algolovers.newsletterconsole.data.model.api.response.questions.QuestionsResponse;
import com.algolovers.newsletterconsole.repository.QuestionsRepository;
import com.algolovers.newsletterconsole.repository.ResponseRepository;
import com.algolovers.newsletterconsole.service.cache.GroupCacheService;
import com.algolovers.newsletterconsole.service.utiity.GoogleDriveService;
import com.google.api.services.drive.model.File;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
@Transactional(rollbackFor = {Exception.class}, propagation = Propagation.NESTED)
public class QuestionsService {

    private final GroupCacheService groupCacheService;
    private final QuestionsRepository questionsRepository;
    private final ResponseRepository responseRepository;
    private final GoogleDriveService googleDriveService;

    public Result<QuestionsResponse> createOrUpdateQuestions(@Valid GroupQuestionsRequest groupQuestionsRequest, User authenticatedUser) {
        try {
            Optional<Group> optionalGroup = groupCacheService.findById(groupQuestionsRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found");
            }

            Group group = optionalGroup.get();

            if (group.isAcceptQuestionResponse()) {
                return new Result<>(false, null, "Cannot accept changes to questions until newsletter is published");
            }

            Optional<GroupMember> groupMember = group
                    .getGroupMembers()
                    .stream()
                    .filter(member ->
                            authenticatedUser
                                    .getEmailAddress()
                                    .equals(member.getUser().getEmailAddress()))
                    .findFirst();

            if (groupMember.isEmpty()) {
                return new Result<>(false, null, "You are not part of this group");
            }

            if (!groupMember.get().isHasEditAccess()) {
                return new Result<>(false, null, "You do not have edit access to update questions, try requesting access from the group owner");
            }

            List<Question> questions = group.getQuestions();

            if (!questions.isEmpty()) {
                questionsRepository.deleteAll(questions);
                questions.clear();
            }

            groupQuestionsRequest.getQuestions().forEach((question) -> {
                Question newQuestion = Question
                        .builder()
                        .question(question.getQuestion())
                        .questionType(question.getQuestionType())
                        .hint(question.getHint())
                        .questionIndex(question.getQuestionIndex())
                        .build();

                if (QuestionType.isMultipleOptionQuestion(question.getQuestionType())) {
                    Set<String> options = question.getOptions();
                    if (options != null && !options.isEmpty()) {
                        newQuestion.setOptions(options);
                    } else {
                        throw new RuntimeException("Options not found for question");
                    }
                }

                questions.add(newQuestion);
                questionsRepository.save(newQuestion);
            });

            group.setQuestions(questions);
            groupCacheService.save(group);

            QuestionsResponse questionsResponse = QuestionsResponse
                    .builder()
                    .questions(questions)
                    .group(group)
                    .build();

            return new Result<>(true, questionsResponse, "Questions updated successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    public Result<QuestionsResponse> getQuestions(@Valid GroupRequest groupRequest, User authenticatedUser) {
        try {
            Optional<Group> optionalGroup = groupCacheService.findById(groupRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found");
            }

            Group group = optionalGroup.get();

            Optional<GroupMember> groupMember = group
                    .getGroupMembers()
                    .stream()
                    .filter(member ->
                            authenticatedUser
                                    .getEmailAddress()
                                    .equals(member.getUser().getEmailAddress()))
                    .findFirst();

            if (groupMember.isEmpty()) {
                return new Result<>(false, null, "You are not part of this group");
            }

            if (Objects.isNull(group.getQuestions())) {
                return new Result<>(false, null, "You have no questions setup so far");
            }

            List<Question> questions =
                    group.getQuestions()
                            .stream()
                            .sorted(Comparator.comparingInt(Question::getQuestionIndex))
                            .toList();

            boolean userExists = group.getQuestionResponses()
                    .stream()
                    .anyMatch(responseData -> responseData.getUserEmailAddress().equals(authenticatedUser.getEmailAddress()));

            QuestionsResponse questionsResponse = QuestionsResponse
                    .builder()
                    .questions(questions)
                    .group(group)
                    .questionsAlreadyTaken(userExists)
                    .build();

            return new Result<>(true, questionsResponse, "Questions fetched successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    public Result<Group> submitResponses(@Valid FormDataResponse formDataResponse, User authenticatedUser) {
        Optional<Group> groupOptional = groupCacheService.findById(formDataResponse.getGroupId());

        if (groupOptional.isEmpty()) {
            return new Result<>(false, null, "The provided group was not found");
        }

        Group group = groupOptional.get();

        List<ResponseData> questionResponse = group.getQuestionResponses();
        boolean userExists = questionResponse
                .stream()
                .anyMatch(responseData -> responseData.getUserEmailAddress().equals(authenticatedUser.getEmailAddress()));

        if (userExists) {
            return new Result<>(false, null, "You have already taken this form");
        }

        Optional<GroupMember> groupMember = group
                .getGroupMembers()
                .stream()
                .filter(member ->
                        authenticatedUser
                                .getEmailAddress()
                                .equals(member.getUser().getEmailAddress()))
                .findFirst();

        if (groupMember.isEmpty()) {
            return new Result<>(false, null, "You are not part of this group");
        }

        List<Question> questions =
                group.getQuestions()
                        .stream()
                        .sorted(Comparator.comparingInt(Question::getQuestionIndex))
                        .toList();

        List<FormQuestionResponse> formQuestionResponses = formDataResponse.getResponses();

        if (formQuestionResponses.size() != questions.size()) {
            return new Result<>(false, null, "Responses do not match the length of questions");
        }

        List<String> validationErrors = formQuestionResponses.stream()
                .map(response -> validateResponse(response, questions))
                .filter(Objects::nonNull)
                .toList();

        if (!validationErrors.isEmpty()) {
            String errorMessage = String.join(", ", validationErrors);
            return new Result<>(false, null, "Validation errors: " + errorMessage);
        }

        ResponseData responseData = new ResponseData();
        responseData.setUserEmailAddress(authenticatedUser.getEmailAddress());
        responseData.setUserName(authenticatedUser.getDisplayName());
        responseData.setUserProfilePicture(authenticatedUser.getProfilePicture());
        responseData.setResponseDate(LocalDateTime.now());
        responseData.setQuestionResponses(convertToQuestionResponses(formQuestionResponses, questions, group.getId()));

        responseRepository.save(responseData);

        questionResponse.add(responseData);
        group.setQuestionResponses(questionResponse);
        groupCacheService.save(group);

        return new Result<>(true, group, "Saved response successfully");
    }

    private String validateResponse(FormQuestionResponse response, List<Question> questions) {
        Question matchingQuestion = questions.stream()
                .filter(question -> question.getId().equals(response.getId()))
                .findFirst()
                .orElse(null);

        if (matchingQuestion == null) {
            return "No matching question found for response with ID: " + response.getId();
        }

        if (matchingQuestion.getQuestionType() != response.getType()) {
            return "Question type mismatch for question with ID: " + response.getId();
        }

        return null;
    }

    private Set<QuestionResponse> convertToQuestionResponses(List<FormQuestionResponse> formQuestionResponses, List<Question> questions, String groupId) {
        return formQuestionResponses.stream()
                .map(formResponse -> {

                    Question question = findQuestionById(questions, formResponse.getId());
                    QuestionResponse questionResponse = new QuestionResponse();
                    questionResponse.setQuestionId(question.getId());
                    questionResponse.setQuestion(question.getQuestion());
                    questionResponse.setQuestionType(question.getQuestionType());

                    if (formResponse.getType() != QuestionType.IMAGE) {
                        questionResponse.setAnswer(String.valueOf(formResponse.getResponse()));
                    } else {
                        try {
                            String base64String = String.valueOf(formResponse.getResponse());

                            // Split the base64 string to extract only the data part
                            String[] parts = base64String.split(",");
                            if (parts.length != 2) {
                                throw new RuntimeException("Invalid base64 string format");
                            }
                            String base64Data = parts[1];

                            // Get image format
                            String imageFormat = getImageFormat(parts[0]);
                            if (!isValidImageFormat(imageFormat)) {
                                throw new RuntimeException("Invalid image format");
                            }

                            // Decode base64 string and save as image file
                            byte[] fileBytes = Base64.getDecoder().decode(base64Data);

                            // Upload image to Google drive
                            String imageKey = UUID.randomUUID().toString();
                            File file = googleDriveService.uploadFile(groupId, imageKey, "image/jpeg", fileBytes);
                            questionResponse.setAnswer(googleDriveService.getPublicUrl(file));

                            //TODO: Write method to purge old images
                        } catch (Exception e) {
                            log.error("Error handling image upload", e);
                            throw new RuntimeException("Error handling image upload", e);
                        }

                    }
                    return questionResponse;
                })
                .collect(Collectors.toSet());
    }

    private Question findQuestionById(List<Question> questions, String questionId) {
        return questions.stream()
                .filter(question -> question.getId().equals(questionId))
                .findFirst()
                .orElse(null);
    }

    private String getImageFormat(String extensionString) {
        String[] headerParts = extensionString.split(";");
        String[] typeParts = headerParts[0].split("/");
        return (typeParts.length >= 2) ? typeParts[1] : null;
    }

    private boolean isValidImageFormat(String imageFormat) {
        return imageFormat != null && (imageFormat.equalsIgnoreCase("jpeg") || imageFormat.equalsIgnoreCase("png"));
    }


}
