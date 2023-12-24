package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.groups.Invitation;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, String> {

    void deleteById_Group(Group group);

    Optional<Invitation> findInvitationById_EmailAddressAndId_Group_Id(@Email String emailAddress, String groupId);

    List<Invitation> findInvitationById_EmailAddress(String email);

    List<Invitation> findInvitationById_Group_Id(String id_group_id);

}
