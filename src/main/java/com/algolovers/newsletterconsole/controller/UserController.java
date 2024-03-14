package com.algolovers.newsletterconsole.controller;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.data.model.api.request.auth.ChangeUserName;
import com.algolovers.newsletterconsole.service.data.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/updateDisplayPicture")
    public Result<User> uploadImage(@RequestParam("image") MultipartFile imageFile) {
        User userDetails = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            byte[] imageData = imageFile.getBytes();
            return userService.uploadUserDisplayPicture(imageData, userDetails);
        } catch (Exception e) {
            return new Result<>(false, null, "Image could not be uploaded");
        }
    }

    @GetMapping("/{subPath}")
    public ResponseEntity<Result<String>> handleInvalidSubPath(@PathVariable String subPath) {
        String errorMessage = "Invalid sub-path: /api/auth/" + subPath;
        return new ResponseEntity<>(new Result<>(false, null, errorMessage), HttpStatus.NOT_FOUND);
    }
}
