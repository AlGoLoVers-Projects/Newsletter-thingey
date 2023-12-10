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
import com.algolovers.newsletterconsole.utils.CookieHelper;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import static com.algolovers.newsletterconsole.utils.Constants.AUTH_COOKIE_KEY;

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
    public ResponseEntity<Result<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        if (!authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(new Result<>(false, null, "Error: Cannot authenticate user"));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userService.generateCookieForAuthenticatedUser(authentication, response);

        return ResponseEntity.ok(new Result<>(true, new LoginResponse(user.getDisplayName(), user.getAuthorities()), "Authentication successful"));
    }

    @GetMapping("/logout")
    public ResponseEntity<Result<String>> logout(HttpServletResponse response) {
        CookieHelper.clearCookie(response, AUTH_COOKIE_KEY);
        return ResponseEntity.ok(new Result<>(true, null, "Logged out successfully"));
    }

    @GetMapping("/{subPath}")
    public ResponseEntity<Result<String>> handleInvalidSubPath(@PathVariable String subPath) {
        String errorMessage = "Invalid sub-path: /api/auth/" + subPath;
        return new ResponseEntity<>(new Result<>(false, null, errorMessage), HttpStatus.NOT_FOUND);
    }

}
