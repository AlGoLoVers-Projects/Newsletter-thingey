package com.algolovers.newsletterconsole.data.entity.questions;

import com.algolovers.newsletterconsole.data.entity.converter.StringSetConverter;
import com.algolovers.newsletterconsole.data.enums.QuestionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "question")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private Integer questionIndex;

    @Column(nullable = false)
    private String question;

    private String hint;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    @Convert(converter = StringSetConverter.class)
    private Set<String> options;
}
