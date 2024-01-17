package com.algolovers.newsletterconsole.data.model.api.response.group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupForm {
    String groupId;
    String groupName;
    String groupDescription;
}
