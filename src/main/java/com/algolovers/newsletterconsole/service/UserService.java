package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.request.UserCreationRequest;
import com.algolovers.newsletterconsole.data.model.api.request.VerificationRequest;
import com.algolovers.newsletterconsole.repository.UserRepository;
import org.springframework.data.util.Pair;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Set;

@Service
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
        return userRepository.findByEmailAddress(email).orElse(null);
    }

    @Transactional(rollbackFor = {RuntimeException.class})
    public Pair<Boolean, String> provisionNewUser(UserCreationRequest userCreationRequest) throws RuntimeException {

        if (userRepository.existsByEmailAddress(userCreationRequest.getEmailAddress())) {
            return Pair.of(false, "Email is already in use");
        }

        User user = User.builder()
                .userName(userCreationRequest.getUserName())
                .emailAddress(userCreationRequest.getEmailAddress())
                .authorities(Set.of(Authority.USER))
                .password(passwordEncoder.encode(userCreationRequest.getPassword()))
                .build();

        Long verificationToken = user.generateAccountVerificationCode();

        user = userRepository.save(user);

        if (user.getId() == null) {
            return Pair.of(false, "User could not be saved");
        }

        boolean isMailSuccessful = emailService.sendVerificationEmail(user, verificationToken);

        if (!isMailSuccessful) {
            throw new RuntimeException("Email could not be sent");
        }

        return Pair.of(true, "User registered successfully");
    }


    public Pair<Boolean, String> verifyUser(VerificationRequest verificationRequest) {

        if (Objects.isNull(verificationRequest.getVerificationCode())
                || Objects.isNull(verificationRequest.getEmail())) {
            return Pair.of(false, "Required information is not attached");
        }

        User user = loadUserByEmail(verificationRequest.getEmail());

        if (Objects.isNull(user)) {
            return Pair.of(false, "User not found");
        }

        if (!user.validateUser()) {
            userRepository.delete(user);
            return Pair.of(false, "Misconfigured user");
        }

        if (user.isAccountVerified()) {
            return Pair.of(false, "User is already verified");
        }

        if (user.hasVerificationExpired()) {
            userRepository.delete(user);
            return Pair.of(false, "Verification token has expired");
        }

        if (user.getEmailAddress().equals(verificationRequest.getEmail())
                && user.getAccountVerificationCode().equals(verificationRequest.getVerificationCode())) {
            user.setVerified();
            userRepository.save(user);
            return Pair.of(true, "User verified successfully");
        }

        //TODO: Send creation success email

        return Pair.of(false, "Verification failed, please check your email and verification code");
    }
}
