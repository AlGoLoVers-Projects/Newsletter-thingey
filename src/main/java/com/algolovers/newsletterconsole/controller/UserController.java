package com.algolovers.newsletterconsole.controller;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.auth.ChangeUserName;
import com.algolovers.newsletterconsole.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    final UserService userService;

    @GetMapping("/authorizedUserDetails")
    public User getUser() {
        User userDetails = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.loadUserByEmail(userDetails.getUsername());
    }

    @PostMapping("/updateUserDisplayName")
    public Result<User> updateUserDisplayName(@RequestBody ChangeUserName changeUserName) {
        User userDetails = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.updateUserDisplayName(changeUserName, userDetails);
    }

    @GetMapping("/{subPath}")
    public ResponseEntity<Result<String>> handleInvalidSubPath(@PathVariable String subPath) {
        String errorMessage = "Invalid sub-path: /api/auth/" + subPath;
        return new ResponseEntity<>(new Result<>(false, null, errorMessage), HttpStatus.NOT_FOUND);
    }
}
