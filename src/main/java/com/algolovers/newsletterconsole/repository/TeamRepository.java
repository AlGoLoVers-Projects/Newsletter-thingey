package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.team.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {

}
