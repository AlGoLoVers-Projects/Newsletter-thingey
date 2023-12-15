package com.algolovers.newsletterconsole.data.entity.groups;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Table(name = "invitation")
@Entity
@Data
public class Invitation {

    @EmbeddedId
    private InvitationId id;

    @CreationTimestamp
    @Column(name = "invitation_date", updatable = false)
    private LocalDateTime invitationDate;

    public boolean hasExpired() {
        int expirationDays = 7;

        LocalDateTime expirationDate = invitationDate.plusDays(expirationDays);
        LocalDateTime currentDate = LocalDateTime.now();

        return currentDate.isAfter(expirationDate);
    }
}
