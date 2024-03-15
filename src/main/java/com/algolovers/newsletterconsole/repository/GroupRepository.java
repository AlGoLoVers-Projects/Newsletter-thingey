package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, String> {

    @Query("SELECT g FROM Group g JOIN FETCH g.groupMembers gm WHERE gm.user = :user")
    List<Group> findByGroupMembersUser(User user);

    @Query("SELECT g FROM Group g JOIN g.groupMembers gm WHERE gm.user = :user AND g.acceptQuestionResponse = :acceptQuestionResponse")
    List<Group> findByGroupMembersUserAndAcceptQuestionResponse(User user, boolean acceptQuestionResponse);

}
