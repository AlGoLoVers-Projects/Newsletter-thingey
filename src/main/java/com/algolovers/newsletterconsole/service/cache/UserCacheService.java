package com.algolovers.newsletterconsole.service.cache;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.Objects;

import static com.algolovers.newsletterconsole.config.CacheManagerConfig.USER_CACHE;
import static com.algolovers.newsletterconsole.config.CacheManagerConfig.USER_ID_CACHE;

@Service
@RequiredArgsConstructor
public class UserCacheService {
    private final UserRepository userRepository;

    @Cacheable(value = USER_CACHE, key = "#email", unless = "#result == null")
    public User loadUserByEmail(String email) {
        if (Objects.isNull(email)) return null;
        return userRepository.findByEmailAddress(email).orElse(null);
    }

    @Cacheable(value = USER_ID_CACHE, key = "#id", unless = "#result == null")
    public User loadUserById(String id) {
        if (Objects.isNull(id)) return null;
        return userRepository.findById(id).orElse(null);
    }

    @Caching(put = {
            @CachePut(value = USER_CACHE, key = "#user.emailAddress"),
            @CachePut(value = USER_ID_CACHE, key = "#user.id")
    })
    public User save(User user) {
        return userRepository.save(user);
    }

    @CacheEvict(value = USER_CACHE, key = "#user.emailAddress")
    @Caching(evict = {
            @CacheEvict(value = USER_CACHE, key = "#user.emailAddress"),
            @CacheEvict(value = USER_ID_CACHE, key = "#user.id")
    })
    public void delete(User user) {
        userRepository.delete(user);
    }
}

