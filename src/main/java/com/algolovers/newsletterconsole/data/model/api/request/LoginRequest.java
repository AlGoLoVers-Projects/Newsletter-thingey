package com.algolovers.newsletterconsole.data.model.api.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginRequest {
    @NotEmpty
    private String email;
    @NotEmpty
    private String password;
}
