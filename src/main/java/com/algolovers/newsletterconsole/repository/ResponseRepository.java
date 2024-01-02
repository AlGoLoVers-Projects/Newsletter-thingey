package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.reponse.ResponseData;
import com.algolovers.newsletterconsole.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResponseRepository extends JpaRepository<ResponseData, String> {
    Optional<ResponseData> getResponseDataByUserAndGroup(User user, Group group);

    void deleteResponseDataByGroup(Group group);
}
