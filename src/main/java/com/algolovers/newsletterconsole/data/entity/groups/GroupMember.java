package com.algolovers.newsletterconsole.data.entity.groups;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Table(name = "group_member")
@Entity
@Data
public class GroupMember {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private boolean hasEditAccess;
}

