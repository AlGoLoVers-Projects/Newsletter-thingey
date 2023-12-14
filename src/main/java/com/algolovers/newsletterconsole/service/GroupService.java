package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.groups.GroupMember;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.group.GroupCreationRequest;
import com.algolovers.newsletterconsole.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    //TODO: Add methods: Create new group (by authorised user), add user -> invitation. Send invitation, accept invitation.
    public Result<Group> provisionNewGroup(GroupCreationRequest groupCreationRequest, User groupOwner) {

        Group group = Group
                .builder()
                .groupName(groupCreationRequest.getGroupName())
                .groupDescription(groupCreationRequest.getGroupDescription())
                .groupMembers(new ArrayList<>())
                .groupOwner(groupOwner)
                .build();

        GroupMember groupOwnerMember = new GroupMember();
        groupOwnerMember.setGroup(group);
        groupOwnerMember.setUser(groupOwner);
        groupOwnerMember.setHasEditAccess(true);

        try {
            return new Result<>(true, groupRepository.save(group), "New group provisioned successfully");
        } catch (Exception e) {
            return new Result<>(false, null, e.getMessage());
        }
    }

    public Result<Group> addNewUserToGroup() {
        return null;
    }


}
