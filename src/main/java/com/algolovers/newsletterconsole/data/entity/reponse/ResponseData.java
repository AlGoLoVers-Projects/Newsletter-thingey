package com.algolovers.newsletterconsole.data.entity.reponse;

import com.algolovers.newsletterconsole.data.entity.converter.QuestionResponseSetConverter;
import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "response_data")
@Data
public class ResponseData {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    Group group;

    @ManyToOne
    User user;

    @CreationTimestamp
    private LocalDateTime verificationTokenExpirationDate;

    @Convert(converter = QuestionResponseSetConverter.class)
    Set<QuestionResponse> questionResponses;

}
