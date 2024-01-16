package com.algolovers.newsletterconsole.data.model.api.response.questions;

import lombok.Data;

import java.util.List;

@Data
public class FormDataResponse {
    private List<FormQuestionResponse> responses;
    private String groupId;
}
