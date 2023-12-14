package com.algolovers.newsletterconsole.data.model.api.request.group;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class GroupUserRemovalRequest {
    @NotEmpty(message = "Group ID cannot be empty")
    String groupId;

    @Email(message = "Invalid email format")
    String userEmail;
}
