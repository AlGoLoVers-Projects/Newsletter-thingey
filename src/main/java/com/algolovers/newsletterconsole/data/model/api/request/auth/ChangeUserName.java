package com.algolovers.newsletterconsole.data.model.api.request.auth;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangeUserName {
    @NotEmpty(message = "Username cannot be empty")
    @Size(min = 3, message = "Username must be at least 3 characters long")
    @Pattern(regexp = "^[a-zA-Z0-9_ ]*$", message = "Username can only contain letters, numbers, spaces, and underscores.")
    String userName;
}
