package com.algolovers.newsletterconsole.data.model.api.request.group;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class GroupCreationRequest {
    @NotEmpty(message = "Group name cannot be empty")
    @Pattern(regexp = "^[a-zA-Z0-9_ ]*$", message = "Username can only contain letters, numbers, spaces, and underscores.")
    String groupName;

    @NotEmpty(message = "Group description cannot be empty")
    String groupDescription;

}
