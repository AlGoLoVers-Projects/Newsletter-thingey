package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.questions.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionsRepository extends JpaRepository<Question, String> {
}
