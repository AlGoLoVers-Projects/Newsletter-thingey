package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.groups.GroupMember;
import com.algolovers.newsletterconsole.data.entity.groups.Invitation;
import com.algolovers.newsletterconsole.data.entity.groups.InvitationId;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.group.*;
import com.algolovers.newsletterconsole.repository.GroupMemberRepository;
import com.algolovers.newsletterconsole.repository.GroupRepository;
import com.algolovers.newsletterconsole.repository.InvitationRepository;
import com.algolovers.newsletterconsole.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupService {

    private final GroupRepository groupRepository;
    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;

    @Transactional(rollbackFor = {Exception.class})
    public Result<Group> provisionNewGroup(@Valid GroupCreationRequest groupCreationRequest, @Valid User groupOwner) {

        Group group = Group
                .builder()
                .groupName(groupCreationRequest.getGroupName())
                .groupDescription(groupCreationRequest.getGroupDescription())
                .groupMembers(new HashSet<>())
                .groupOwner(groupOwner)
                .build();

        GroupMember groupOwnerMember = new GroupMember();
        groupOwnerMember.setUser(groupOwner);
        groupOwnerMember.setHasEditAccess(true);

        groupMemberRepository.save(groupOwnerMember);

        group.getGroupMembers().add(groupOwnerMember);

        try {
            Group savedGroup = groupRepository.save(group);

            return new Result<>(true, savedGroup, "New group provisioned successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<Group> editGroupInformation(@Valid GroupDetailsEditRequest groupDetailsEditRequest, User authenticatedUser) {

        try {
            Optional<Group> optionalGroup = groupRepository.findById(groupDetailsEditRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found, cannot generate invitation");
            }

            Group group = optionalGroup.get();

            if (!group.getGroupOwner().getEmailAddress().equals(authenticatedUser.getEmailAddress())) {
                return new Result<>(false, null, "Only the group owner can edit group information");
            }

            group.setGroupName(groupDetailsEditRequest.getGroupName());
            group.setGroupDescription(groupDetailsEditRequest.getGroupDescription());

            group = groupRepository.save(group);
            return new Result<>(true, group, "Group edited successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<List<Group>> listAllGroups(User authenticatedUser) {
        try {
            return new Result<>(true, groupRepository.findByGroupMembersUser(authenticatedUser), "Fetched all groups successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<Invitation> inviteUserToGroup(@Valid GroupUserInvitationRequest groupUserInvitationRequest, User authenticatedUser) {
        try {

            Optional<Group> optionalGroup = groupRepository.findById(groupUserInvitationRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found, cannot generate invitation");
            }

            Group group = optionalGroup.get();

            if (!group.getGroupOwner().getEmailAddress().equals(authenticatedUser.getEmailAddress())) {
                return new Result<>(false, null, "Only the group owner can invite new users");
            }

            if (group.getGroupOwner().getEmailAddress().equals(groupUserInvitationRequest.getUserEmail())) {
                return new Result<>(false, null, "You cannot invite yourself to the group");
            }

            Set<GroupMember> groupMembers = group.getGroupMembers();
            if (groupMembers.stream().anyMatch(groupMember -> groupMember.getUser().getEmailAddress().equals(groupUserInvitationRequest.getUserEmail()))) {
                return new Result<>(false, null, "User already exists in group");
            }

            Invitation invitation = new Invitation();

            InvitationId invitationId = new InvitationId();
            invitationId.setEmailAddress(groupUserInvitationRequest.getUserEmail());
            invitationId.setGroup(group);

            invitation.setId(invitationId);

            invitationRepository.save(invitation);

            Optional<User> invitedUser = userRepository.findByEmailAddress(groupUserInvitationRequest.getUserEmail());

            if (invitedUser.isEmpty()) {
                //TODO: Prepare email for invitation instead
                return new Result<>(true, invitation, "Invitation created, user does not exist. An invitation to the app has been sent");
            } else {
                User user = invitedUser.get();
                //TODO: Prepare email for invitation with invitation code embedded in URL
                return new Result<>(true, invitation, "Invitation has been sent to user");
            }
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(true, null, e.getMessage());
        }
    }

    public Result<List<Invitation>> listAllInvitations(User authorisedUser) {
        try {
            List<Invitation> invitations = invitationRepository.findInvitationById_EmailAddress(authorisedUser.getEmailAddress());
            return new Result<>(true, invitations, "Invitation fetched successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    public Result<List<Invitation>> listAllInvitationsByGroup(GroupRequest groupRequest) {
        try {
            List<Invitation> invitations = invitationRepository.findInvitationById_Group_Id(groupRequest.getGroupId());
            return new Result<>(true, invitations, "Invitation fetched successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<Invitation> removeInvitationFromGroup(GroupUserInvitationRequest groupUserInvitationRequest, User authenticatedUser) {
        try {
            Optional<Group> optionalGroup = groupRepository.findById(groupUserInvitationRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found, cannot delete invitation");
            }

            Group group = optionalGroup.get();

            if (!group.getGroupOwner().getEmailAddress().equals(authenticatedUser.getEmailAddress())) {
                return new Result<>(false, null, "Only the group owner can delete invitations");
            }

            Optional<Invitation> optionalInvitation = invitationRepository.findInvitationById_EmailAddressAndId_Group_Id(
                    groupUserInvitationRequest.getUserEmail(), groupUserInvitationRequest.getGroupId());

            if (optionalInvitation.isEmpty()) {
                return new Result<>(false, null, "The invitation was not found");
            }

            Invitation invitation = optionalInvitation.get();

            invitationRepository.delete(invitation);
            return new Result<>(true, invitation, "Invitation has been deleted successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    //TODO: Add controller to let user delete their invitations for a group

    @Transactional(rollbackFor = {Exception.class})
    public Result<String> acceptInvitation(GroupRequest groupRequest, User authenticatedUser) {

        try {
            Optional<Invitation> optionalInvitation = invitationRepository.findInvitationById_EmailAddressAndId_Group_Id(
                    authenticatedUser.getEmailAddress(), groupRequest.getGroupId());

            if (optionalInvitation.isEmpty()) {
                return new Result<>(false, null, "The invitation was not found");
            }

            Invitation invitation = optionalInvitation.get();

            if (invitation.hasExpired()) {
                invitationRepository.delete(invitation);
                return new Result<>(false, null, "The invitation has expired");
            }

            Group group = invitation.getId().getGroup();
            if (group == null) {
                invitationRepository.delete(invitation);
                return new Result<>(false, null, "Group not found");
            }

            Set<GroupMember> groupMembers = group.getGroupMembers();
            if (groupMembers.stream().anyMatch(groupMember -> groupMember.getUser().getEmailAddress().equals(authenticatedUser.getEmailAddress()))) {
                return new Result<>(false, null, "User already exists in group");
            }

            GroupMember groupMember = new GroupMember();
            groupMember.setUser(authenticatedUser);
            groupMember.setHasEditAccess(false);

            groupMemberRepository.save(groupMember);

            groupMembers.add(groupMember);

            groupRepository.save(group);
            invitationRepository.delete(invitation);

            return new Result<>(true, null, "User has been added to group successfully");

            //TODO: Send email?
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<String> rejectInvitation(GroupRequest groupRequest, User authenticatedUser) {
        try {
            Optional<Invitation> optionalInvitation = invitationRepository.findInvitationById_EmailAddressAndId_Group_Id(
                    authenticatedUser.getEmailAddress(), groupRequest.getGroupId());

            if (optionalInvitation.isEmpty()) {
                return new Result<>(false, null, "The invitation was not found");
            }

            Invitation invitation = optionalInvitation.get();

            invitationRepository.delete(invitation);
            return new Result<>(true, null, "Invitation has been rejected");

        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<Group> updateEditAccessToUser(GroupUserEditAccessRequest groupUserEditAccessRequest, User authenticatedUser) {
        try {
            Optional<Group> optionalGroup = groupRepository.findById(groupUserEditAccessRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found, cannot change user edit access");
            }

            Group group = optionalGroup.get();

            if (!group.getGroupOwner().getEmailAddress().equals(authenticatedUser.getEmailAddress())) {
                return new Result<>(false, null, "Only the group owner can modify user permissions");
            }

            Set<GroupMember> groupMembers = group.getGroupMembers();
            Optional<GroupMember> optionalGroupMemberToEdit = groupMembers.stream()
                    .filter(groupMember -> groupMember.getUser().getEmailAddress().equals(groupUserEditAccessRequest.getUserEmail()))
                    .findFirst();

            if (optionalGroupMemberToEdit.isPresent()) {
                GroupMember groupMember = optionalGroupMemberToEdit.get();
                groupMember.setHasEditAccess(groupUserEditAccessRequest.getCanEdit());

                groupMemberRepository.save(groupMember);
                group = groupRepository.save(group);

                return new Result<>(true, group, "User edit access updated successfully successfully");
            } else {
                return new Result<>(false, null, "User not found in the group");
            }
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<Group> removeUser(GroupUserRemovalRequest groupUserRemovalRequest, User authenticatedUser) {

        try {
            Optional<Group> optionalGroup = groupRepository.findById(groupUserRemovalRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found, cannot remove group");
            }

            Group group = optionalGroup.get();

            if (!group.getGroupOwner().getEmailAddress().equals(authenticatedUser.getEmailAddress())) {
                return new Result<>(false, null, "Only the group owner can remove users");
            }

            Set<GroupMember> groupMembers = group.getGroupMembers();
            Optional<GroupMember> optionalGroupMemberToRemove = groupMembers.stream()
                    .filter(groupMember -> groupMember.getUser().getEmailAddress().equals(groupUserRemovalRequest.getUserEmail()))
                    .findFirst();

            if (optionalGroupMemberToRemove.isPresent()) {
                GroupMember groupMemberToRemove = optionalGroupMemberToRemove.get();
                groupMembers.remove(groupMemberToRemove);

                groupMemberRepository.delete(groupMemberToRemove);
                group = groupRepository.save(group);

                return new Result<>(true, group, "User removed from the group successfully");
            } else {
                return new Result<>(false, null, "User not found in the group");
            }
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<String> leaveGroup(GroupRequest groupRequest, User authenticatedUser) {

        try {
            Optional<Group> optionalGroup = groupRepository.findById(groupRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found, cannot leave group");
            }

            Group group = optionalGroup.get();

            if (group.getGroupOwner().getEmailAddress().equals(authenticatedUser.getEmailAddress())) {
                return new Result<>(false, null, "Group owner cannot leave group, consider deleting group instead");
            }

            //TODO: Remove all responses in future when leaving group. No orphan data whatsoever

            Set<GroupMember> groupMembers = group.getGroupMembers();
            Optional<GroupMember> optionalGroupMemberToRemove = groupMembers.stream()
                    .filter(groupMember -> groupMember.getUser().getEmailAddress().equals(authenticatedUser.getEmailAddress()))
                    .findFirst();

            if (optionalGroupMemberToRemove.isPresent()) {
                GroupMember groupMemberToRemove = optionalGroupMemberToRemove.get();
                groupMembers.remove(groupMemberToRemove);

                groupMemberRepository.delete(groupMemberToRemove);
                groupRepository.save(group);

                return new Result<>(true, null, "Exitted group successfully");
            } else {
                return new Result<>(false, null, "User not found in the group");
            }
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public Result<String> deleteGroup(GroupRequest groupRequest, User authenticatedUser) {

        try {
            Optional<Group> optionalGroup = groupRepository.findById(groupRequest.getGroupId());

            if (optionalGroup.isEmpty()) {
                return new Result<>(false, null, "The provided group was not found, cannot delete group");
            }

            Group group = optionalGroup.get();

            if (!group.getGroupOwner().getEmailAddress().equals(authenticatedUser.getEmailAddress())) {
                return new Result<>(false, null, "Only group owner can delete group");
            }

            Set<GroupMember> groupMembers = group.getGroupMembers();
            groupMemberRepository.deleteAll(group.getGroupMembers());
            groupMembers.clear();

            invitationRepository.deleteById_Group(group);
            groupRepository.delete(group);

            return new Result<>(true, null, "Group has been deleted successfully");
        } catch (Exception e) {
            log.error("Exception occurred: {}", e.getMessage(), e);
            return new Result<>(false, null, e.getMessage());
        }
    }
}
