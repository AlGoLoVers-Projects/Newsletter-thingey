package com.algolovers.newsletterconsole.data.model.api.request.group;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GroupUserEditAccessRequest {
    @NotEmpty(message = "Group ID cannot be empty")
    String groupId;

    @Email(message = "Invalid email format")
    String userEmail;

    @NotNull(message = "Edit access cannot be null")
    Boolean canEdit;
}
