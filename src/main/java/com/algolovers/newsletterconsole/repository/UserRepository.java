package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.user.User;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @QueryHints({
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    Optional<User> findByEmailAddress(String username);

    @QueryHints({
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    Boolean existsByEmailAddress(String email);

}

