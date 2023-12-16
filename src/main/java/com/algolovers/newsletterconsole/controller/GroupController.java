package com.algolovers.newsletterconsole.controller;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.groups.Invitation;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.group.*;
import com.algolovers.newsletterconsole.service.GroupService;
import com.algolovers.newsletterconsole.utils.ControllerUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group")
@RequiredArgsConstructor
public class GroupController {

    final GroupService groupService;

    @PostMapping("/provisionNewGroup")
    public ResponseEntity<Result<String>> provisionNewGroup(@Valid @RequestBody GroupCreationRequest groupCreationRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Group> result = groupService.provisionNewGroup(groupCreationRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @PutMapping("/editGroupInformation")
    public ResponseEntity<Result<String>> editGroupInformation(@Valid @RequestBody GroupDetailsEditRequest groupDetailsEditRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.editGroupInformation(groupDetailsEditRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @GetMapping("/listAllGroups")
    public ResponseEntity<Result<List<Group>>> listAllGroups() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<List<Group>> result = groupService.listAllGroups(user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @PostMapping("/inviteUserToGroup")
    public ResponseEntity<Result<String>> inviteUserToGroup(@Valid @RequestBody GroupUserInvitationRequest groupUserInvitationRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Invitation> result = groupService.inviteUserToGroup(groupUserInvitationRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @GetMapping("/listAllInvitations")
    public ResponseEntity<Result<List<Invitation>>> listAllInvitations() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<List<Invitation>> result = groupService.listAllInvitations(user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @PostMapping("/acceptInvitation")
    public ResponseEntity<Result<String>> acceptInvitation(@Valid @RequestBody GroupUserInvitationAcceptRequest groupUserInvitationAcceptRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.acceptInvitation(groupUserInvitationAcceptRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @PutMapping("/updateEditAccessToUser")
    public ResponseEntity<Result<String>> updateEditAccessToUser(@Valid @RequestBody GroupUserEditAccessRequest groupUserEditAccessRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.updateEditAccessToUser(groupUserEditAccessRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @DeleteMapping("/removeUser")
    public ResponseEntity<Result<String>> removeUser(@Valid @RequestBody GroupUserRemovalRequest groupUserRemovalRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.removeUser(groupUserRemovalRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @DeleteMapping("/leaveGroup")
    public ResponseEntity<Result<String>> leaveGroup(@Valid @RequestBody GroupUserLeaveRequest groupUserLeaveRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.leaveGroup(groupUserLeaveRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @DeleteMapping("/deleteGroup")
    public ResponseEntity<Result<String>> deleteGroup(@Valid @RequestBody GroupDeletionRequest groupDeletionRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.deleteGroup(groupDeletionRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    //TODO: Add controller to let group owner give edit access.

}
