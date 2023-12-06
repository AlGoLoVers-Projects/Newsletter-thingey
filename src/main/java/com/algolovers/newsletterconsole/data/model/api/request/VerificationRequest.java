package com.algolovers.newsletterconsole.data.model.api.request;

import lombok.Getter;

@Getter
public class VerificationRequest {
    private String email;
    private Long verificationCode;
}
