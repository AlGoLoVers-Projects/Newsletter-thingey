package com.algolovers.newsletterconsole.data.entity.user;

import com.algolovers.newsletterconsole.utils.RandomGenerator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Table(name = "user")
@Entity
@Data
public class User implements UserDetails {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    @Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Username can only contain alphanumeric characters and underscores")
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

    Long accountValidityCode;

    Long passwordResetCode;

    @ElementCollection(targetClass = Authority.class)
    @JoinTable(name = "authority", joinColumns = @JoinColumn(name = "id"))
    @Enumerated(EnumType.STRING)
    List<Authority> authorities;

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
        return userName;
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

    public Long setNewPassword(String encodedPassword, Long passwordResetCode) {
        if (Objects.nonNull(passwordResetCode)
                && Objects.nonNull(this.passwordResetCode)
                && Objects.nonNull(encodedPassword)
                && this.passwordResetCode.equals(passwordResetCode)) {
            this.password = encodedPassword;
            this.passwordResetCode = null;
            return generateAccountValidityCode();
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

    public void setVerified(Boolean verified) {
        if (verified) {
            this.accountVerificationCode = null;
            this.verificationTokenExpirationDate = null;
        }
    }

    public Boolean isAccountVerified() {
        return Objects.isNull(this.accountVerificationCode) && Objects.isNull(this.verificationTokenExpirationDate);
    }

    public Boolean hasVerificationExpired() {
        if (Objects.nonNull(this.verificationTokenExpirationDate)) {
            return LocalDateTime.now().isAfter(verificationTokenExpirationDate);
        }

        return false;
    }

    /**
     * Generates a unique 8 digit validity ID used for token validation
     *
     * @return 8 digit JWT verification ID
     */
    public Long generateAccountValidityCode() {
        return this.accountValidityCode = RandomGenerator.generateRandomCode();
    }
}
