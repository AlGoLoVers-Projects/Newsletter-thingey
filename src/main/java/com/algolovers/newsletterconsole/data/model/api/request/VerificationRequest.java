package com.algolovers.newsletterconsole.data.model.api.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;

@Getter
public class VerificationRequest {
    @NotEmpty
    private String email;
    @NotEmpty
    private Long verificationCode;
}
