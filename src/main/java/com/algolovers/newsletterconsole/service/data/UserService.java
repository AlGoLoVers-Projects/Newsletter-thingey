package com.algolovers.newsletterconsole.service.data;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.enums.AuthProvider;
import com.algolovers.newsletterconsole.data.model.AuthenticatedUserToken;
import com.algolovers.newsletterconsole.data.model.GoogleOAuthUserInfo;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.auth.*;
import com.algolovers.newsletterconsole.exceptions.PasswordResetException;
import com.algolovers.newsletterconsole.repository.UserRepository;
import com.algolovers.newsletterconsole.service.cache.UserCacheService;
import com.algolovers.newsletterconsole.service.utiity.EmailService;
import com.algolovers.newsletterconsole.service.utiity.GoogleDriveService;
import com.algolovers.newsletterconsole.service.utiity.JwtService;
import com.google.api.services.drive.model.File;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static com.algolovers.newsletterconsole.data.enums.AuthProvider.local;

@Service
@Transactional(rollbackFor = {Exception.class}, propagation = Propagation.NESTED)
@AllArgsConstructor
public class UserService implements UserDetailsService {

    final UserRepository userRepository;
    final UserCacheService userCacheService;
    final PasswordEncoder passwordEncoder;
    final EmailService emailService;
    final JwtService jwtService;
    final GoogleDriveService googleDriveService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails userDetails = loadUserByEmail(email);
        if (Objects.isNull(userDetails)) {
            throw new UsernameNotFoundException(String.format("user with email %s was not found", email));
        }

        return userDetails;
    }

    public User loadUserByEmail(String email) {
        return userCacheService.loadUserByEmail(email);
    }

    public User loadUserById(String id) {
        return userCacheService.loadUserById(id);
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
                    .authProvider(local)
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

                return new Result<>(true, savedUser, "User registered successfully, please verify your account");
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

            if (!user.validateUserDetails()) {
                userCacheService.delete(user);
                return new Result<>(false, null, "Misconfigured user");
            }

            if (user.isAccountVerified()) {
                return new Result<>(false, null, "User is already verified");
            }

            if (user.hasVerificationExpired()) {
                userCacheService.delete(user);
                return new Result<>(false, null, "Verification token has expired");
            }

            if (!user.getEmailAddress().equals(verificationRequest.getEmail())) {
                return new Result<>(false, null, "Incorrect email address attached");
            }

            if (!user.getAccountVerificationCode().equals(verificationRequest.getVerificationCode())) {
                return new Result<>(false, null, "Incorrect verification code");
            }

            //TODO: Send creation success email

            user.setVerified();
            userCacheService.save(user);
            return new Result<>(true, user, "User verified successfully");

        } catch (Exception e) {
            return new Result<>(false, null, "An unexpected error occurred during user verification: " + e.getMessage());
        }
    }

    public Result<User> saveOrUpdateUser(User user) {
        try {
            user = userCacheService.save(user);
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

        return userCacheService.save(user);
    }

    public Result<User> updateUserDisplayName(@Valid ChangeUserName changeUserName, User authentiatedUser) {
        authentiatedUser.setDisplayName(changeUserName.getUserName());
        return saveOrUpdateUser(authentiatedUser);
    }

    public Result<User> uploadUserDisplayPicture(byte[] imageData, User authentiatedUser) throws IOException {
        File file = googleDriveService.replaceImageInFolder("profile-picture", authentiatedUser.getId(),  imageData);
        authentiatedUser.setProfilePicture(googleDriveService.getPublicUrl(file));
        return saveOrUpdateUser(authentiatedUser);
    }

    public AuthenticatedUserToken generateTokenForAuthenticatedUser(Authentication authentication, Optional<User> optionalUser) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user;
        user = optionalUser.orElseGet(() -> loadUserByEmail(userDetails.getUsername()));

        String validityCode = getExistingAccountValidityCode(user);
        String token = jwtService.generateToken(user, validityCode);

        return new AuthenticatedUserToken(user, token);
    }

    public Result<String> forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {

        if (Objects.isNull(forgotPasswordRequest)) {
            return new Result<>(false, "", "Forgot password request invalid");
        }

        if (Objects.isNull(forgotPasswordRequest.getEmail())) {
            return new Result<>(false, "", "Email address missing");
        }

        User user = loadUserByEmail(forgotPasswordRequest.getEmail());

        if (Objects.isNull(user)) {
            return new Result<>(false, "", "User does not exist");
        }

        if (!local.equals(user.getAuthProvider())) {
            return new Result<>(false, "", "Cannot reset password for OAuth user");
        }

        try {
            Long passwordResetCode = user.generatePasswordResetCode();
            boolean isMailSuccessful = emailService.sendPasswordResetEmail(user, passwordResetCode);

            if (!isMailSuccessful) {
                return new Result<>(false, "", "Failed to send reset link to email address");
            }

            return new Result<>(true, "", "Reset link sent successfully");
        } catch (PasswordResetException e) {
            return new Result<>(false, "", e.getMessage());
        }
    }

    public Result<String> resetPassword(@Valid ResetPasswordRequest resetPasswordRequest) {
        User user = loadUserById(resetPasswordRequest.getId());

        if (Objects.isNull(user)) {
            return new Result<>(false, "", "User does not exist");
        }

        if (!local.equals(user.getAuthProvider())) {
            return new Result<>(false, "", "Cannot reset password for OAuth user");
        }

        try {
            if (passwordEncoder.matches(resetPasswordRequest.getPassword(), user.getPassword())) {
                return new Result<>(false, "", "New password cannot be same as old password");
            }

            return user.setNewPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()), resetPasswordRequest.getVerificationCode());
        } catch (PasswordResetException e) {
            return new Result<>(false, "", e.getMessage());
        }
    }

}
