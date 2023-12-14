package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, String> {

}
