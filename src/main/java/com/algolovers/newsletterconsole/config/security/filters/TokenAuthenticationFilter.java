package com.algolovers.newsletterconsole.config.security.filters;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.service.JwtService;
import com.algolovers.newsletterconsole.service.UserService;
import com.algolovers.newsletterconsole.utils.CookieHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.Optional;

import static com.algolovers.newsletterconsole.utils.Constants.AUTH_COOKIE_KEY;
import static org.springframework.util.ObjectUtils.isEmpty;

@Component
@AllArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Get authorization cookie and validate
        Cookie[] cookies = request.getCookies();
        String token;

        Optional<String> cookie = CookieHelper.retrieve(cookies, AUTH_COOKIE_KEY);

        if (cookie.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        token = URLDecoder.decode(cookie.get(), StandardCharsets.UTF_8);

        if (isEmpty(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String userId = jwtService.getUserIdFromToken(token);
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


