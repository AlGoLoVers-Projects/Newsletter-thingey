package com.algolovers.newsletterconsole.data.entity.user;

import com.algolovers.newsletterconsole.utils.RandomGenerator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;


import java.time.LocalDateTime;
import java.util.*;

@Table(name = "user")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails, OAuth2User {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    @Pattern(regexp = "^[a-zA-Z0-9_ ]*$", message = "Username can only contain alphanumeric characters and underscores")
    @Size(min = 3, message = "Username must have a minimum of three characters")
    String userName;

    @Column
    String password;

    @Column(unique = true)
    @Email
    String emailAddress;

    @Column(name = "verification_token_expiration_date")
    @JsonIgnore
    private LocalDateTime verificationTokenExpirationDate;

    Long accountVerificationCode;

    String accountValidityCode;

    Long passwordResetCode;

    @ElementCollection(targetClass = Authority.class)
    @JoinTable(name = "authority", joinColumns = @JoinColumn(name = "id"))
    @Enumerated(EnumType.STRING)
    Set<Authority> authorities;

    @Override
    public Collection<Authority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return emailAddress;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return Objects.isNull(this.passwordResetCode);
    }

    @Override
    public boolean isEnabled() {
        return Objects.isNull(this.accountVerificationCode) && Objects.isNull(verificationTokenExpirationDate);
    }

    public Long generatePasswordResetCode() {
        return this.passwordResetCode = RandomGenerator.generateRandomCode();
    }

    /**
     * Validates constraints and sets new password, generates a new validity code for JWT token
     *
     * @param encodedPassword   New encoded password, encoded using BCrypt
     * @param passwordResetCode Password reset code, verified against code in database
     * @return New validity code for JWT authentication, old tokens will be unusable
     */

    public String setNewPassword(String encodedPassword, Long passwordResetCode) {
        if (Objects.nonNull(passwordResetCode)
                && Objects.nonNull(this.passwordResetCode)
                && Objects.nonNull(encodedPassword)
                && this.passwordResetCode.equals(passwordResetCode)) {
            this.password = encodedPassword;
            this.passwordResetCode = null;
            return generateNewAccountValidityCode();
        }

        return null;
    }

    /**
     * One time account verification, used to verify new account. Record is deleted after verification
     *
     * @return New verification code for account registration.
     */
    public Long generateAccountVerificationCode() {
        this.verificationTokenExpirationDate = LocalDateTime.now().plusMinutes(15);
        return this.accountVerificationCode = RandomGenerator.generateRandomCode();
    }

    public void setVerified() {
        this.accountVerificationCode = null;
        this.verificationTokenExpirationDate = null;
    }

    public Boolean isAccountVerified() {
        return Objects.isNull(this.accountVerificationCode);
    }

    public Boolean hasVerificationExpired() {
        if (Objects.nonNull(this.verificationTokenExpirationDate)) {
            return LocalDateTime.now().isAfter(verificationTokenExpirationDate);
        }

        return false;
    }

    public boolean validateUser() {
        return Objects.nonNull(id) && Objects.nonNull(emailAddress) && Objects.nonNull(userName);
    }

    /**
     * Generates a unique 8 digit validity ID used for token validation
     *
     * @return 8 digit JWT verification ID
     */
    public String getExistingAccountValidityCode() {
        if(Objects.isNull(this.accountValidityCode)) {
            return generateNewAccountValidityCode();
        }

        return this.accountValidityCode;
    }

    private String generateNewAccountValidityCode() {
        return this.accountValidityCode = RandomGenerator.generateRandomToken(16);
    }

    @Override
    public String getName() {
        return null;
    }


    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }
}
