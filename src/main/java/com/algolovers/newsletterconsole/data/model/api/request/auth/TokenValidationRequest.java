package com.algolovers.newsletterconsole.data.model.api.request.auth;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class TokenValidationRequest {
    @NotEmpty(message = "Token cannot be empty")
    private String token;
}
