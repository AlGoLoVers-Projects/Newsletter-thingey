package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.enums.AuthProvider;
import com.algolovers.newsletterconsole.data.model.GoogleOAuthUserInfo;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.UserCreationRequest;
import com.algolovers.newsletterconsole.data.model.api.request.VerificationRequest;
import com.algolovers.newsletterconsole.repository.UserRepository;
import com.algolovers.newsletterconsole.utils.CookieHelper;
import jakarta.servlet.http.HttpServletResponse;
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

import java.time.Duration;
import java.util.Objects;
import java.util.Set;

import static com.algolovers.newsletterconsole.utils.Constants.AUTH_COOKIE_KEY;

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
            if (userRepository.existsByEmailAddress(userCreationRequest.getEmailAddress())) {
                return new Result<>(false, null, "Email is already in use");
            }

            User user = User.builder()
                    .displayName(userCreationRequest.getUserName())
                    .emailAddress(userCreationRequest.getEmailAddress())
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

    public User registerNewOAuthUser(OAuth2UserRequest oAuth2UserRequest, GoogleOAuthUserInfo oAuth2UserInfo) {
        User user = new User();

        user.setAuthProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setDisplayName(oAuth2UserInfo.getName());
        user.setEmailAddress(oAuth2UserInfo.getEmail());
        return userRepository.save(user);
    }

    public User updateExistingUser(User existingUser, GoogleOAuthUserInfo oAuth2UserInfo) {
        existingUser.setDisplayName(oAuth2UserInfo.getName());
        return userRepository.save(existingUser);
    }

    public User generateCookieForAuthenticatedUser(Authentication authentication, HttpServletResponse response) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = loadUserByEmail(userDetails.getUsername());

        String validityCode = getExistingAccountValidityCode(user);
        String token = jwtService.generateToken(user, validityCode);
        response.addCookie(CookieHelper.generateCookie(AUTH_COOKIE_KEY, token, Duration.ofHours(24)));

        return user;
    }

}
