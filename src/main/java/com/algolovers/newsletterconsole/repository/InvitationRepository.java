package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.groups.Invitation;
import jakarta.persistence.QueryHint;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, String> {

    @QueryHints({
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    void deleteById_Group(Group group);

    @QueryHints({
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    Optional<Invitation> findInvitationById_EmailAddressAndId_Group_Id(@Email String emailAddress, String groupId);

    @QueryHints({
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    List<Invitation> findInvitationById_EmailAddress(String email);

    @QueryHints({
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    List<Invitation> findInvitationById_Group_Id(String id_group_id);

}
