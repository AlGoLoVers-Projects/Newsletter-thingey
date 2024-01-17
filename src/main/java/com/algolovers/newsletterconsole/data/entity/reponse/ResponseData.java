package com.algolovers.newsletterconsole.data.entity.reponse;

import com.algolovers.newsletterconsole.data.entity.converter.QuestionResponseSetConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    Set<QuestionResponse> questionResponses;

}
