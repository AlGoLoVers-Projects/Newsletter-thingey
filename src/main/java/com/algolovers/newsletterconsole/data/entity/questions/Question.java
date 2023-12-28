package com.algolovers.newsletterconsole.data.entity.questions;

import com.algolovers.newsletterconsole.data.entity.converter.StringSetConverter;
import com.algolovers.newsletterconsole.data.enums.QuestionType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Table(name = "question")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "question_type")

@Data
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String question;

    private String hint;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType;

    @Convert(converter = StringSetConverter.class)
    private Set<String> options;
}
