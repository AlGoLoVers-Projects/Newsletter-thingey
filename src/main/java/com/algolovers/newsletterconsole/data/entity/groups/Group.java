package com.algolovers.newsletterconsole.data.entity.groups;

import com.algolovers.newsletterconsole.data.entity.questions.Question;
import com.algolovers.newsletterconsole.data.entity.reponse.ResponseData;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;


@Table(name = "newsletter_group")
@Entity
@Data
@AllArgsConstructor
@Builder
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Group {

    public Group() {
        groupMembers = new HashSet<>();
        questions = new ArrayList<>();
        questionResponses = new ArrayList<>();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 30)
    @Pattern(regexp = "^[a-zA-Z0-9_ ]*$", message = "Username can only contain alphanumeric characters and underscores")
    @Size(min = 3, max = 30, message = "Username must have a minimum of three characters and maximum of 30 characters")
    String groupName;

    @Column(nullable = false, length = 2000)
    @Size(min = 3, max = 2000, message = "Description must have a minimum of three and maximum of 2000 characters")
    String groupDescription;

    @ManyToOne
    @JoinColumn(name = "group_owner_id", nullable = false)
    private User groupOwner;

    @OneToMany
    @Builder.Default
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<GroupMember> groupMembers = new HashSet<>();

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Builder.Default
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private List<Question> questions = new ArrayList<>();

    private boolean acceptQuestionResponse = false; //FALSE -> set to true when questions are released. Form collects data then and saves response. response is cleared during any shift of this value. clicking on publish will set this value back to false.

    @OneToMany
    @Builder.Default
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private List<ResponseData> questionResponses = new ArrayList<>();

    private LocalDateTime releaseDate;

    public boolean canRelease() {
        if (Objects.isNull(releaseDate)) {
            return true;
        }

        LocalDate releaseDateWithoutTime = releaseDate.toLocalDate();
        LocalDate currentDateWithoutTime = LocalDate.now();
        return releaseDateWithoutTime.isBefore(currentDateWithoutTime);
    }

    public boolean release() {
        boolean release = canRelease();

        if (release) {
            LocalDate currentDate = LocalDate.now();
            LocalDate releaseDate25DaysLater = currentDate.plusDays(25);
            this.releaseDate = releaseDate25DaysLater.atStartOfDay();
        }

        return release;
    }

    @Override
    public String toString() {
        return "Group{" +
                "id=" + id +
                ", groupName='" + groupName + '\'' +
                ", groupDescription='" + groupDescription + '\'' +
                ", groupOwner='" + groupOwner + '\'' +
                '}';
    }

}
