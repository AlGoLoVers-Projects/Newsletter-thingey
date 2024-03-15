package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query(value = "SELECT u FROM User u WHERE u.emailAddress = :username")
    Optional<User> findByEmailAddress(String username);

    Boolean existsByEmailAddress(String email);

}

