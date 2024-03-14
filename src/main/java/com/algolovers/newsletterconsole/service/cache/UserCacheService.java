package com.algolovers.newsletterconsole.service.cache;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserCacheService {
    private final UserRepository userRepository;

    @Cacheable(value = "userCache", key = "#email", unless = "#result == null")
    public User loadUserByEmail(String email) {
        if (Objects.isNull(email)) return null;
        return userRepository.findByEmailAddress(email).orElse(null);
    }

    @CachePut(value = "userCache", key = "#user.emailAddress")
    public User save(User user) {
        return userRepository.save(user);
    }

    @CacheEvict(value = "userCache", key = "#user.emailAddress")
    public void delete(User user) {
        userRepository.delete(user);
    }
}

