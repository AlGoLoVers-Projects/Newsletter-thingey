package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.questions.Question;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.group.GroupRequest;
import com.algolovers.newsletterconsole.data.model.api.request.question.GroupQuestionsRequest;
import com.algolovers.newsletterconsole.repository.GroupRepository;
import com.algolovers.newsletterconsole.repository.QuestionsRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class QuestionsService {

    private final QuestionsRepository questionsRepository;
    private final GroupRepository groupRepository;

    @Transactional(rollbackFor = {Exception.class})
    public Result<List<Question>> createOrUpdateQuestions(@Valid GroupQuestionsRequest groupQuestionsRequest) {
        return null;
    }

    public Result<List<Question>> getQuestions(@Valid GroupRequest groupRequest) {
        return null;
    }

}
