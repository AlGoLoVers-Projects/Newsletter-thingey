package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.UserCreationRequest;
import com.algolovers.newsletterconsole.data.model.api.request.VerificationRequest;
import com.algolovers.newsletterconsole.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Set;

@Service
@Transactional(rollbackFor = {Exception.class})
public class UserService implements UserDetailsService {

    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails userDetails = loadUserByEmail(email);
        if (Objects.isNull(userDetails)) {
            throw new UsernameNotFoundException(String.format("user with email %s was not found", email));
        }

        return userDetails;
    }

    public User loadUserByEmail(String email) {
        if (Objects.isNull(email)) return null;
        return userRepository.findByEmailAddress(email).orElse(null);
    }

    public User loadUserById(String id) {
        if (Objects.isNull(id)) return null;
        return userRepository.findById(id).orElse(null);
    }

    public Result<User> provisionNewUser(UserCreationRequest userCreationRequest) {
        try {
            if (userRepository.existsByEmailAddress(userCreationRequest.getEmailAddress())) {
                return new Result<>(false, null, "Email is already in use");
            }

            User user = User.builder()
                    .displayName(userCreationRequest.getUserName())
                    .emailAddress(userCreationRequest.getEmailAddress())
                    .authorities(Set.of(Authority.USER))
                    .password(passwordEncoder.encode(userCreationRequest.getPassword()))
                    .build();

            Result<User> saveResult = saveOrUpdateUser(user);
            if (saveResult.isSuccess()) {
                User savedUser = saveResult.getData();

                Long verificationToken = savedUser.generateAccountVerificationCode();

                boolean isMailSuccessful = emailService.sendVerificationEmail(savedUser, verificationToken);

                if (!isMailSuccessful) {
                    throw new RuntimeException("Email could not be sent");
                }

                return new Result<>(true, savedUser, "User registered successfully");
            } else {
                return new Result<>(false, null, saveResult.getMessage());
            }
        } catch (Exception e) {
            return new Result<>(false, null, "An unexpected error occurred during user registration: " + e.getMessage());
        }
    }

    public Result<User> verifyUser(VerificationRequest verificationRequest) {
        try {
            if (Objects.isNull(verificationRequest.getVerificationCode())
                    || Objects.isNull(verificationRequest.getEmail())) {
                return new Result<>(false, null, "Required information is not attached");
            }

            User user = loadUserByEmail(verificationRequest.getEmail());

            if (Objects.isNull(user)) {
                return new Result<>(false, null, "User not found");
            }

            if (!user.validateUser()) {
                userRepository.delete(user);
                return new Result<>(false, null, "Misconfigured user");
            }

            if (user.isAccountVerified()) {
                return new Result<>(false, null, "User is already verified");
            }

            if (user.hasVerificationExpired()) {
                userRepository.delete(user);
                return new Result<>(false, null, "Verification token has expired");
            }

            if (user.getEmailAddress().equals(verificationRequest.getEmail())
                    && user.getAccountVerificationCode().equals(verificationRequest.getVerificationCode())) {
                user.setVerified();
                userRepository.save(user);
                return new Result<User>(true, user, "User verified successfully");
            }

            //TODO: Send creation success email

            return new Result<>(false, null, "Verification failed, please check your email and verification code");
        } catch (Exception e) {
            return new Result<>(false, null, "An unexpected error occurred during user verification: " + e.getMessage());
        }
    }

    public Result<User> saveOrUpdateUser(User user) {
        try {
            user = userRepository.save(user);
            return new Result<>(true, user, "User saved successfully");
        } catch (DataIntegrityViolationException ex) {
            return new Result<>(false, null, "User could not be saved due to a database constraint violation");
        } catch (RuntimeException ex) {
            return new Result<>(false, null, "User could not be saved");
        }
    }

    public String getExistingAccountValidityCode(User user) {
       String code = user.getExistingAccountValidityCode();
       saveOrUpdateUser(user);
       return code;
    }

}
