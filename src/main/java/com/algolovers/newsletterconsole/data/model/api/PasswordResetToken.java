package com.algolovers.newsletterconsole.data.model.api;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PasswordResetToken {
    @NotEmpty
    String id;
}
