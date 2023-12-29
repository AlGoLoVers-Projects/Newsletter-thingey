package com.algolovers.newsletterconsole.data.model.api.request.question;

import com.algolovers.newsletterconsole.data.enums.QuestionType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class QuestionRequest {

    @NotNull(message = "Index cannot be null")
    private Integer index;

    @NotEmpty(message = "Question cannot be blank")
    private String question;

    private String hint;

    @NotNull(message = "Question type cannot be null")
    private QuestionType questionType;

    private Set<String> options;

}