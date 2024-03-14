package com.algolovers.newsletterconsole.controller;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.group.GroupRequest;
import com.algolovers.newsletterconsole.data.model.api.request.question.GroupQuestionsRequest;
import com.algolovers.newsletterconsole.data.model.api.response.questions.FormDataResponse;
import com.algolovers.newsletterconsole.data.model.api.response.questions.QuestionsResponse;
import com.algolovers.newsletterconsole.service.data.QuestionsService;
import com.algolovers.newsletterconsole.utils.ControllerUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionsController {

    private final QuestionsService questionsService;

    @PostMapping("/createOrUpdateQuestions")
    public ResponseEntity<Result<QuestionsResponse>> createOrUpdateQuestions(@Valid @RequestBody GroupQuestionsRequest groupQuestionsRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<QuestionsResponse> questions = questionsService.createOrUpdateQuestions(groupQuestionsRequest, user);
        return ControllerUtils.processResultForResponseWithData(questions);
    }

    @PostMapping("/getQuestions")
    public ResponseEntity<Result<QuestionsResponse>> getQuestions(@Valid @RequestBody GroupRequest groupRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<QuestionsResponse> questions = questionsService.getQuestions(groupRequest, user);
        return ControllerUtils.processResultForResponseWithData(questions);
    }

    @PostMapping("/submitResponses")
    public ResponseEntity<Result<Group>> submitResponses(@RequestBody FormDataResponse formDataResponse) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Group> result = questionsService.submitResponses(formDataResponse, user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

}
