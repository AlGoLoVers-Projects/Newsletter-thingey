package com.algolovers.newsletterconsole.controller;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.AuthenticatedUserToken;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.auth.*;
import com.algolovers.newsletterconsole.data.model.api.response.auth.AuthData;
import com.algolovers.newsletterconsole.service.JwtService;
import com.algolovers.newsletterconsole.service.UserService;
import com.algolovers.newsletterconsole.utils.ControllerUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

import static org.springframework.util.ObjectUtils.isEmpty;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    final UserService userService;
    final AuthenticationManager authenticationManager;
    final JwtService jwtService;

    @GetMapping("/test")
    public String test() {
        return "hello";
    }

    @PostMapping("/signup")
    public ResponseEntity<Result<String>> registerUser(@Valid @RequestBody UserCreationRequest signUpRequest) {
        try {
            Result<User> result = userService.provisionNewUser(signUpRequest);
            return ControllerUtils.processResultForResponse(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new Result<>(false, null, e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Result<String>> verifyUser(@Valid @RequestBody VerificationRequest verificationRequest) {
        Result<User> result = userService.verifyUser(verificationRequest);
        return ControllerUtils.processResultForResponse(result);
    }

    @PostMapping("/signin")
    public ResponseEntity<Result<AuthData>> authenticateUser(@Valid @RequestBody SignInRequest signinRequest) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword()));

        if (!authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(new Result<>(false, null, "Cannot authenticate user, check credentials"));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        AuthenticatedUserToken authenticatedUserToken = userService.generateTokenForAuthenticatedUser(authentication, Optional.empty());

        AuthData authData = AuthData
                .builder()
                .authorities(authenticatedUserToken.getUser().getAuthorities())
                .displayName(authenticatedUserToken.getUser().getDisplayName())
                .profilePicture(authenticatedUserToken.getUser().getProfilePicture())
                .token(authenticatedUserToken.getToken())
                .build();

        return ResponseEntity.ok(new Result<>(true, authData, "Authentication successful"));
    }

    @PostMapping("/validateToken")
    public ResponseEntity<Result<AuthData>> validateToken(@Valid @RequestBody TokenValidationRequest tokenValidationRequest) {

        if (Objects.isNull(tokenValidationRequest)) {
            return new ResponseEntity<>(new Result<>(false, null, "Please attach authentication token"), HttpStatus.UNAUTHORIZED);
        }

        String token = tokenValidationRequest.getToken();

        if (Objects.isNull(token) || isEmpty(token)) {
            return new ResponseEntity<>(new Result<>(false, null, "Please attach authentication token"), HttpStatus.UNAUTHORIZED);
        }

        String userId = jwtService.getUserIdFromToken(token);
        User user = userService.loadUserById(userId);

        if (Objects.isNull(user)) {
            return new ResponseEntity<>(new Result<>(false, null, "No active users were found for token"), HttpStatus.UNAUTHORIZED);
        }

        if (!jwtService.validateToken(token, user)) {
            return new ResponseEntity<>(new Result<>(false, null, "Token has expired"), HttpStatus.UNAUTHORIZED);
        }

        AuthData authData = AuthData
                .builder()
                .authorities(user.getAuthorities())
                .displayName(user.getDisplayName())
                .profilePicture(user.getProfilePicture())
                .build();

        return ResponseEntity.ok(new Result<>(true, authData, "Token successfully validated"));
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<Result<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        Result<String> result = userService.forgotPassword(forgotPasswordRequest);
        return ControllerUtils.processResultForResponse(result);
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<Result<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        Result<String> result = userService.resetPassword(resetPasswordRequest);
        return ControllerUtils.processResultForResponse(result);
    }

    @GetMapping("/{subPath}")
    public ResponseEntity<Result<String>> handleInvalidSubPath(@PathVariable String subPath) {
        String errorMessage = "Invalid sub-path: /api/auth/" + subPath;
        return new ResponseEntity<>(new Result<>(false, null, errorMessage), HttpStatus.NOT_FOUND);
    }

}
