package com.algolovers.newsletterconsole.data.entity.groups;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class InvitationId implements Serializable {
    @Column(nullable = false)
    @Email
    String emailAddress;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;
}
