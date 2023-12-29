package com.algolovers.newsletterconsole.data.model.api.request.question;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class GroupQuestionsRequest {
    @NotEmpty(message = "Group ID cannot be empty")
    String groupId;
    List<QuestionRequest> questions;
}
