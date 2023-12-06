package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserDetailsService {

    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmailAddress(email).orElse(null);
    }

    //TODO: Add DTO class here
    public User provisionNewUser() {
        User user = User.builder()
                .userName("Soorya S")
                .emailAddress("soorya.s27@gmail.com")
                .password(passwordEncoder.encode("Password123!"))
                .build();

        userRepository.save(user);

        return user;
    }
}
