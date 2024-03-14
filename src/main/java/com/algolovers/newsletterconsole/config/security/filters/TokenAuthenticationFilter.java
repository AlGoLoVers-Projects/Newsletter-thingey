package com.algolovers.newsletterconsole.config.security.filters;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.Result;
import com.algolovers.newsletterconsole.service.utiity.JwtService;
import com.algolovers.newsletterconsole.service.data.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Objects;

import static org.springframework.util.ObjectUtils.isEmpty;

@Component
@AllArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String token = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (Objects.isNull(token) || isEmpty(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String userId = "";

        try {
            userId = jwtService.getUserIdFromToken(token);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Result<String> result = Result.<String>builder()
                    .success(false)
                    .message("Unauthorized request")
                    .build();

            String jsonResponse = objectMapper.writeValueAsString(result);

            try (PrintWriter writer = response.getWriter()) {
                writer.write(jsonResponse);
            }

            return;
        }

        User user = userService.loadUserById(userId);

        if (Objects.isNull(user)) {
            filterChain.doFilter(request, response);
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


