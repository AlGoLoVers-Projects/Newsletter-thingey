package com.algolovers.newsletterconsole.data.entity.team;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Table(name = "team")
@Entity
@Data
public class Team {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    @Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Username can only contain alphanumeric characters and underscores")
    @Size(min = 3, max = 30, message = "Username must have a minimum of three characters and maximum of 30 characters")
    String teamName;

    @ManyToOne
    @JoinColumn(name = "team_owner_id", nullable = false)
    private User teamOwner;

    @OneToMany(mappedBy = "team")
    private List<TeamMember> teamMembers;

    //TODO: Add questions. Questions -> List<Questions> it can be edited modified bla bla.
    //Monthly responses should be maintained somewhere
    //private List<Questions> questions;

}
