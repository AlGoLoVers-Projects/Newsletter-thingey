package com.algolovers.newsletterconsole.data.entity.reponse;

import com.algolovers.newsletterconsole.data.entity.converter.QuestionResponseSetConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "response_data")
@Data
@Immutable
public class ResponseData {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Email
    private String userEmailAddress;

    @CreationTimestamp
    private LocalDateTime responseDate;

    @Convert(converter = QuestionResponseSetConverter.class)
    @Column(length = 65000)
    @JsonIgnore
    Set<QuestionResponse> questionResponses;

}
