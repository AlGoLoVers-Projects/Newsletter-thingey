package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.enums.AuthProvider;
import com.algolovers.newsletterconsole.data.model.AuthenticatedUserToken;
import com.algolovers.newsletterconsole.data.model.GoogleOAuthUserInfo;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.UserCreationRequest;
import com.algolovers.newsletterconsole.data.model.api.request.VerificationRequest;
import com.algolovers.newsletterconsole.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional(rollbackFor = {Exception.class})
@AllArgsConstructor
public class UserService implements UserDetailsService {

    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final EmailService emailService;
    final JwtService jwtService;

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
            if (userRepository.existsByEmailAddress(userCreationRequest.getEmail())) {
                return new Result<>(false, null, "Email is already in use");
            }

            User user = User.builder()
                    .displayName(userCreationRequest.getUserName())
                    .emailAddress(userCreationRequest.getEmail())
                    .authorities(Set.of(Authority.USER))
                    .authProvider(AuthProvider.local)
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

            if (!user.getEmailAddress().equals(verificationRequest.getEmail())) {
                return new Result<>(false, null, "Incorrect email address attached");
            }

            if(!user.getAccountVerificationCode().equals(verificationRequest.getVerificationCode())) {
                return new Result<>(false, null, "Incorrect verification code");
            }

            //TODO: Send creation success email

            user.setVerified();
            userRepository.save(user);
            return new Result<>(true, user, "User verified successfully");

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

    public User registerNewOAuthUser(OAuth2UserRequest oAuth2UserRequest, GoogleOAuthUserInfo oAuth2UserInfo) {
        User user = User.builder()
                .displayName(oAuth2UserInfo.getName())
                .emailAddress(oAuth2UserInfo.getEmail())
                .authorities(Set.of(Authority.USER))
                .profilePicture(oAuth2UserInfo.getImageUrl())
                .authProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))
                .build();

        return userRepository.save(user);
    }

    public AuthenticatedUserToken generateTokenForAuthenticatedUser(Authentication authentication, Optional<User> optionalUser) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user;
        user = optionalUser.orElseGet(() -> loadUserByEmail(userDetails.getUsername()));

        String validityCode = getExistingAccountValidityCode(user);
        String token = jwtService.generateToken(user, validityCode);

        return new AuthenticatedUserToken(user, token);
    }

}
