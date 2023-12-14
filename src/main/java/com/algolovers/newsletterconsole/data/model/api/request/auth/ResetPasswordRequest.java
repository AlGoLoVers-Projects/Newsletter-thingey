package com.algolovers.newsletterconsole.data.model.api.request.auth;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    @NotEmpty(message = "Id cannot be empty")
    private String id;

    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern.List({
            @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter"),
            @Pattern(regexp = ".*[a-z].*", message = "Password must contain at least one lowercase letter"),
            @Pattern(regexp = ".*\\d.*", message = "Password must contain at least one digit"),
            @Pattern(regexp = ".*[^a-zA-Z0-9].*", message = "Password must contain at least one special character")
    })
    String password;

    @NotNull(message = "Password reset code cannot be null")
    private Long verificationCode;

}
