package com.algolovers.newsletterconsole.data.model.api.response.questions;

import com.algolovers.newsletterconsole.data.enums.QuestionType;
import lombok.Data;

@Data
public class FormQuestionResponse {
    private QuestionType type;
    private Object response;
    private String id;
}
