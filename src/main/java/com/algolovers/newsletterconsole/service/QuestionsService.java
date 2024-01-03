package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.groups.GroupMember;
import com.algolovers.newsletterconsole.data.entity.questions.Question;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.enums.QuestionType;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.group.GroupRequest;
import com.algolovers.newsletterconsole.data.model.api.request.question.GroupQuestionsRequest;
import com.algolovers.newsletterconsole.data.model.api.response.questions.QuestionsResponse;
import com.algolovers.newsletterconsole.repository.GroupRepository;
import com.algolovers.newsletterconsole.repository.QuestionsRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
@Slf4j
public class QuestionsService {

    private final QuestionsRepository questionsRepository;
    private final GroupRepository groupRepository;

    @Transactional(rollbackFor = {Exception.class})
    public Result<QuestionsResponse> createOrUpdateQuestions(@Valid GroupQuestionsRequest groupQuestionsRequest, User authenticatedUser) {
        try {
            Optional<Group> optionalGroup = groupRepository.findById(groupQuestionsRequest.getGroupId());

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

            questionsRepository.deleteAll(questions);
            questions.clear();

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
            groupRepository.save(group);

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
            Optional<Group> optionalGroup = groupRepository.findById(groupRequest.getGroupId());

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

            List<Question> questions =
                    group.getQuestions()
                            .stream()
                            .sorted(Comparator.comparingInt(Question::getQuestionIndex))
                            .toList();

            boolean userExists = group.getQuestionResponses()
                    .stream()
                    .anyMatch(responseData -> responseData.getUser().getEmailAddress().equals(authenticatedUser.getEmailAddress()));

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

}
