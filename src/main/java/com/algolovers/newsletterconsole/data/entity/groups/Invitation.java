package com.algolovers.newsletterconsole.data.entity.groups;

import com.algolovers.newsletterconsole.data.entity.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Table(name = "invitation")
@Entity
@Data
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Email
    String emailAddress;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

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
