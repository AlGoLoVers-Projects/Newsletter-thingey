package com.algolovers.newsletterconsole.service.data;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserDataService {
    private final UserRepository userRepository;

    public User loadUserByEmail(String email) {
        if (Objects.isNull(email)) return null;
        return userRepository.findByEmailAddress(email).orElse(null);
    }

    public User loadUserById(String id) {
        if (Objects.isNull(id)) return null;
        return userRepository.findById(id).orElse(null);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }
}

