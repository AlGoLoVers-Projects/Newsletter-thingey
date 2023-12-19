package com.algolovers.newsletterconsole.data.model.api.request.group;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class GroupCreationRequest {
    @NotEmpty(message = "Group name cannot be empty")
    @Pattern(regexp = "^[a-zA-Z0-9_ ]*$", message = "Group name can only contain letters, numbers, spaces, and underscores.")
    @Size(max = 50, message = "Group name must be at most 50 characters long")
    String groupName;

    @NotEmpty(message = "Group description cannot be empty")
    @Size(max = 250, message = "Group description must be at most 250 characters long")
    String groupDescription;
}

