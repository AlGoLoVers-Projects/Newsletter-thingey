package com.algolovers.newsletterconsole.data.entity.team;

import com.algolovers.newsletterconsole.data.entity.user.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Table(name = "invitation")
@Entity
@Data
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

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
