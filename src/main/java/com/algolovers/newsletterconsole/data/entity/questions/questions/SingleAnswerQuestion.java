package com.algolovers.newsletterconsole.data.entity.questions.questions;

import com.algolovers.newsletterconsole.data.entity.questions.Question;
import com.algolovers.newsletterconsole.data.entity.questions.QuestionType;
import com.algolovers.newsletterconsole.data.enums.SingleAnswerType;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue(value = QuestionType.TEXT)
public class SingleAnswerQuestion extends Question {

    String hint;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    SingleAnswerType singleAnswerType;

    @Override
    public String getQuestionType() {
        return QuestionType.TEXT;
    }
}
