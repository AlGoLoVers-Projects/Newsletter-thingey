package com.algolovers.newsletterconsole.data.entity.reponse;

import com.algolovers.newsletterconsole.data.entity.converter.QuestionResponseSetConverter;
import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.user.User;
import jakarta.persistence.*;
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

    @ManyToOne
    @JsonIgnore
    Group group;

    @ManyToOne
    User user;

    @CreationTimestamp
    private LocalDateTime responseDate;

    @JsonIgnore
    @Convert(converter = QuestionResponseSetConverter.class)
    Set<QuestionResponse> questionResponses;

}
