package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.user.User;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, String> {

    @QueryHints({
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    List<Group> findByGroupMembersUser(User user);

    @QueryHints({
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    List<Group> findByGroupMembersUserAndAcceptQuestionResponse(User user, boolean acceptQuestionResponse);

}
