package com.algolovers.newsletterconsole.data.entity.questions.questions;

import com.algolovers.newsletterconsole.data.entity.converter.StringSetConverter;
import com.algolovers.newsletterconsole.data.entity.questions.Question;
import com.algolovers.newsletterconsole.data.entity.questions.QuestionType;
import com.algolovers.newsletterconsole.data.enums.MultipleAnswerType;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@DiscriminatorValue(value = QuestionType.OPTIONS)
public class MultipleAnswerQuestion extends Question {

    @Convert(converter = StringSetConverter.class)
    @Column(nullable = false)
    Set<String> options;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    MultipleAnswerType multipleAnswerType;

    @Override
    public String getQuestionType() {
        return QuestionType.OPTIONS;
    }
}
