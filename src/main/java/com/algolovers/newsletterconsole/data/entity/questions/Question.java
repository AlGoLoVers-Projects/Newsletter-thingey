package com.algolovers.newsletterconsole.data.entity.questions;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "question")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "question_type")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public abstract class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String question;

    public abstract String getQuestionType();
}
