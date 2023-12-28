package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.questions.Question;
import com.algolovers.newsletterconsole.data.enums.QuestionType;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.repository.GroupRepository;
import com.algolovers.newsletterconsole.repository.QuestionsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@AllArgsConstructor
public class QuestionsService {

    private final QuestionsRepository questionsRepository;
    private final GroupRepository groupRepository;

    @Transactional(rollbackFor = {Exception.class})
    public Result<Question> newQuestion() {
        return null;
    }

    public Result<List<Question>> getQuestions() {
        return null;
    }

}
