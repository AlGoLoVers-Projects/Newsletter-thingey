package com.algolovers.newsletterconsole.data.entity.questions.questions;

import com.algolovers.newsletterconsole.data.entity.questions.Question;
import com.algolovers.newsletterconsole.data.entity.questions.QuestionType;
import com.algolovers.newsletterconsole.data.enums.SingleAnswerType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@DiscriminatorValue(value = QuestionType.TEXT)
public class SingleAnswerQuestion extends Question {

    String hint;

    @Enumerated(EnumType.STRING)
    SingleAnswerType singleAnswerType;

    @Override
    public String getQuestionType() {
        return QuestionType.TEXT;
    }
}
