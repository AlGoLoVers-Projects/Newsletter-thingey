package com.algolovers.newsletterconsole.data.entity.reponse;

import com.algolovers.newsletterconsole.data.enums.QuestionType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuestionResponse {
    String questionId;
    String question;
    String answer;
    Integer questionIndex;
    QuestionType questionType;
}
