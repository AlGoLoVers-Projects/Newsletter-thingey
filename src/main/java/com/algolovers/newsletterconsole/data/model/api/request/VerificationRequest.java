package com.algolovers.newsletterconsole.data.model.api.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class VerificationRequest {
    @NotEmpty
    private String email;
    @NotNull
    private Long verificationCode;
}
