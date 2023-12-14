package com.algolovers.newsletterconsole.data.model.api.request.auth;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationRequest {

    @NotEmpty(message = "Username cannot be empty")
    @Size(min = 3, message = "Username must be at least 3 characters long")
    @Pattern(regexp = "^[a-zA-Z0-9_ ]*$", message = "Username can only contain letters, numbers, spaces, and underscores.")
    String userName;

    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern.List({
            @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter"),
            @Pattern(regexp = ".*[a-z].*", message = "Password must contain at least one lowercase letter"),
            @Pattern(regexp = ".*\\d.*", message = "Password must contain at least one digit"),
            @Pattern(regexp = ".*[^a-zA-Z0-9].*", message = "Password must contain at least one special character")
    })
    String password;

    @NotEmpty(message = "Email cannot be empty")
    @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", message = "Invalid email format")
    String email;
}
