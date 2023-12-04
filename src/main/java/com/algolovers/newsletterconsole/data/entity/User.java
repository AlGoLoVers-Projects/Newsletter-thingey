package com.algolovers.newsletterconsole.data.entity;

import com.algolovers.newsletterconsole.data.enums.Authority;
import com.algolovers.newsletterconsole.utils.RandomGenerator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Table
@Entity
@Data
public class User implements UserDetails {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    String userName;

    @Column
    String password;

    @Column(unique = true)
    String emailAddress;

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
        return Objects.isNull(passwordResetCode);
    }

    @Override
    public boolean isEnabled() {
        return Objects.isNull(this.accountVerificationCode);
    }

    public Long generatePasswordResetCode() {
        return this.passwordResetCode = RandomGenerator.generateRandomCode();
    }

    public Boolean setNewPassword(String encodedPassword, Long passwordResetCode) {
        if (Objects.nonNull(passwordResetCode)
                && Objects.nonNull(this.passwordResetCode)
                && Objects.nonNull(encodedPassword)
                && this.passwordResetCode.equals(passwordResetCode)) {
            this.password = encodedPassword;
            this.passwordResetCode = null;
            return true;
        }

        return false;
    }

    public Long generateAccountVerificationCode() {
        return this.accountVerificationCode = RandomGenerator.generateRandomCode();
    }

    public void setVerified(Boolean verified) {
        if (verified) {
            this.accountVerificationCode = null;
        }
    }

    public Long generateAccountValidityCode() {
        return this.accountValidityCode = RandomGenerator.generateRandomCode();
    }
}
