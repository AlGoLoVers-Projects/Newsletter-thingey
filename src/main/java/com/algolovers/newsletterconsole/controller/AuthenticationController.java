package com.algolovers.newsletterconsole.controller;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.LoginRequest;
import com.algolovers.newsletterconsole.data.model.api.request.UserCreationRequest;
import com.algolovers.newsletterconsole.data.model.api.request.VerificationRequest;
import com.algolovers.newsletterconsole.data.model.api.response.LoginResponse;
import com.algolovers.newsletterconsole.service.JwtService;
import com.algolovers.newsletterconsole.service.UserService;
import com.algolovers.newsletterconsole.utils.ControllerUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    final UserService userService;
    final AuthenticationManager authenticationManager;
    final JwtService jwtService;

    public AuthenticationController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
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
    public ResponseEntity<Result<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        if (!authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(new Result<>(false, null, "Error: Cannot authenticate user"));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.loadUserByEmail(userDetails.getUsername());

        String validityCode = user.getExistingAccountValidityCode();
        userService.saveOrUpdateUser(user);

        String token = jwtService.generateToken(user, validityCode);

        return ResponseEntity.ok(new Result<>(true, new LoginResponse(token, user.getUsername()), "Authentication successful"));
    }

}
