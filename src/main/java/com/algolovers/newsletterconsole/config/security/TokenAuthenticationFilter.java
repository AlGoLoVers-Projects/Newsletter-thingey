package com.algolovers.newsletterconsole.config.security;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.service.JwtService;
import com.algolovers.newsletterconsole.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

import static org.springframework.util.ObjectUtils.isEmpty;

public class TokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    UserService userService;

    @Autowired
    JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Get authorization header and validate
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (isEmpty(token) || !token.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get jwt token and validate
        token = token.split(" ")[1].trim();
        String userId = jwtService.getUserIdFromToken(token);

        User user = userService.loadUserById(userId);

        if (Objects.isNull(user)) {
            return;
        }

        if (!jwtService.validateToken(token, user)) {
            filterChain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                user, null,
                user.getAuthorities()
        );

        authenticationToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        filterChain.doFilter(request, response);

    }
}


