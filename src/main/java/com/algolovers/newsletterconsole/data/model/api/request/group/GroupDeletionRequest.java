package com.algolovers.newsletterconsole.data.model.api.request.group;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class GroupDeletionRequest {
    @NotEmpty(message = "Group ID cannot be empty")
    String groupId;
}
