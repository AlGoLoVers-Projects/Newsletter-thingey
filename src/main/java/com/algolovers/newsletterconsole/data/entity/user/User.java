package com.algolovers.newsletterconsole.data.entity.user;

import com.algolovers.newsletterconsole.data.enums.AuthProvider;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.exceptions.PasswordResetException;
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

import static com.algolovers.newsletterconsole.data.enums.AuthProvider.google;

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
    String displayName;

    @Column
    @JsonIgnore
    String password;

    @Column(unique = true)
    @Email
    String emailAddress;

    @Column(name = "verification_token_expiration_date")
    @JsonIgnore
    private LocalDateTime verificationTokenExpirationDate;

    @Column
    private String profilePicture;

    @JsonIgnore
    Long accountVerificationCode;

    @JsonIgnore
    String accountValidityCode;

    @JsonIgnore
    Long passwordResetCode;

    @Convert(converter = AuthoritySetConverter.class)
    private Set<Authority> authorities;

    @Enumerated(EnumType.STRING)
    @JsonIgnore
    AuthProvider authProvider;

    //Only for intermediate oauth signup
    @Transient
    private Map<String, Object> attributes;

    @Override
    @JsonIgnore
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<Authority> getAuthorities() {
        return authorities;
    }

    @Override
    @JsonIgnore
    public String getName() {
        return displayName;
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return emailAddress;
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return Objects.isNull(this.passwordResetCode);
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return Objects.isNull(this.accountVerificationCode) && Objects.isNull(verificationTokenExpirationDate);
    }

    public Long generatePasswordResetCode() throws PasswordResetException {
        if (google.equals(this.authProvider)) {
            throw new PasswordResetException("Cannot generate reset code for google OAuth account password reset");
        }

        return this.passwordResetCode = RandomGenerator.generateRandomCode();
    }

    /**
     * Validates constraints and sets new password, generates a new validity code for JWT token
     *
     * @param encodedPassword   New encoded password, encoded using BCrypt
     * @param passwordResetCode Password reset code, verified against code in database
     * @return New validity code for JWT authentication, old tokens will be unusable
     */

    public Result<String> setNewPassword(String encodedPassword, Long passwordResetCode) throws PasswordResetException {
        if (google.equals(this.authProvider)) {
            throw new PasswordResetException("Cannot reset password for google OAuth account");
        }

        else if (Objects.isNull(this.passwordResetCode)) {
            return new Result<>(false, null, "Invalid password reset request");
        }

        if (Objects.nonNull(passwordResetCode)
                && Objects.nonNull(encodedPassword)) {

            if (this.passwordResetCode.equals(passwordResetCode)) {
                this.password = encodedPassword;
                this.passwordResetCode = null;
                return new Result<>(true, generateNewAccountValidityCode(), "Password changed successfully");
            } else {
                return new Result<>(false, null, "Codes do not match");
            }
        }

        return new Result<>(false, null, "Password change failed, please check all fields");
    }

    /**
     * One time account verification, used to verify new account. Record is deleted after verification
     *
     * @return New verification code for account registration.
     */
    @JsonIgnore
    public Long generateAccountVerificationCode() {
        this.verificationTokenExpirationDate = LocalDateTime.now().plusMinutes(15);
        return this.accountVerificationCode = RandomGenerator.generateRandomCode();
    }

    public void setVerified() {
        this.accountVerificationCode = null;
        this.verificationTokenExpirationDate = null;
    }

    @JsonIgnore
    public Boolean isAccountVerified() {
        return Objects.isNull(this.accountVerificationCode);
    }

    @JsonIgnore
    public Boolean hasVerificationExpired() {
        if (Objects.nonNull(this.verificationTokenExpirationDate)) {
            return LocalDateTime.now().isAfter(verificationTokenExpirationDate);
        }

        return false;
    }

    @JsonIgnore
    public boolean validateUser() {
        return Objects.nonNull(id) && Objects.nonNull(emailAddress) && Objects.nonNull(displayName);
    }

    /**
     * Generates a unique 8 digit validity ID used for token validation
     *
     * @return 8 digit JWT verification ID
     */
    @JsonIgnore
    public String getExistingAccountValidityCode() {
        if (Objects.isNull(this.accountValidityCode)) {
            return generateNewAccountValidityCode();
        }

        return this.accountValidityCode;
    }

    @JsonIgnore
    private String generateNewAccountValidityCode() {
        return this.accountValidityCode = RandomGenerator.generateRandomToken(16);
    }
}
