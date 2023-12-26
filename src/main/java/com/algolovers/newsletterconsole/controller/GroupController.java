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
    public ResponseEntity<Result<Group>> provisionNewGroup(@Valid @RequestBody GroupCreationRequest groupCreationRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Group> result = groupService.provisionNewGroup(groupCreationRequest, user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @PutMapping("/editGroupInformation")
    public ResponseEntity<Result<Group>> editGroupInformation(@Valid @RequestBody GroupDetailsEditRequest groupDetailsEditRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Group> result = groupService.editGroupInformation(groupDetailsEditRequest, user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @GetMapping("/listAllGroups")
    public ResponseEntity<Result<List<Group>>> listAllGroups() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<List<Group>> result = groupService.listAllGroups(user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @PostMapping("/inviteUserToGroup")
    public ResponseEntity<Result<Invitation>> inviteUserToGroup(@Valid @RequestBody GroupUserInvitationRequest groupUserInvitationRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Invitation> result = groupService.inviteUserToGroup(groupUserInvitationRequest, user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @GetMapping("/listAllInvitations")
    public ResponseEntity<Result<List<Invitation>>> listAllInvitations() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<List<Invitation>> result = groupService.listAllInvitations(user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @PostMapping("/listAllInvitationsByGroup")
    public ResponseEntity<Result<List<Invitation>>> listAllInvitationsByGroup(@Valid @RequestBody GroupRequest groupRequest) {
        Result<List<Invitation>> result = groupService.listAllInvitationsByGroup(groupRequest);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @DeleteMapping("/removeInvitationFromGroup")
    public ResponseEntity<Result<Invitation>> removeInvitationFromGroup(@Valid @RequestBody GroupUserInvitationRequest groupUserInvitationRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Invitation> result = groupService.removeInvitationFromGroup(groupUserInvitationRequest, user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @PostMapping("/acceptInvitation")
    public ResponseEntity<Result<String>> acceptInvitation(@Valid @RequestBody GroupRequest groupRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.acceptInvitation(groupRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @PostMapping("/rejectInvitation")
    public ResponseEntity<Result<String>> rejectInvitation(@Valid @RequestBody GroupRequest groupRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.rejectInvitation(groupRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @PutMapping("/updateEditAccessToUser")
    public ResponseEntity<Result<Group>> updateEditAccessToUser(@Valid @RequestBody GroupUserEditAccessRequest groupUserEditAccessRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Group> result = groupService.updateEditAccessToUser(groupUserEditAccessRequest, user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @DeleteMapping("/removeUser")
    public ResponseEntity<Result<Group>> removeUser(@Valid @RequestBody GroupUserRemovalRequest groupUserRemovalRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<Group> result = groupService.removeUser(groupUserRemovalRequest, user);
        return ControllerUtils.processResultForResponseWithData(result);
    }

    @DeleteMapping("/leaveGroup")
    public ResponseEntity<Result<String>> leaveGroup(@Valid @RequestBody GroupRequest groupRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.leaveGroup(groupRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    @DeleteMapping("/deleteGroup")
    public ResponseEntity<Result<String>> deleteGroup(@Valid @RequestBody GroupRequest groupRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Result<String> result = groupService.deleteGroup(groupRequest, user);
        return ControllerUtils.processResultForResponse(result);
    }

    //TODO: Add controller to let group owner give edit access.

}
