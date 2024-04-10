package com.algolovers.newsletterconsole.data.model.api.request.group;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class GroupFormReminderRequest {
    @NotEmpty(message = "Group ID cannot be empty")
    String groupId;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    String userEmail;

    @NotEmpty(message = "Name cannot be empty")
    String userName;
}
