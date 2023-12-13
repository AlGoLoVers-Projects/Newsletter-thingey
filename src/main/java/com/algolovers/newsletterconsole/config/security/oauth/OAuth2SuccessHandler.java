package com.algolovers.newsletterconsole.config.security.oauth;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.AuthenticatedUserToken;
import com.algolovers.newsletterconsole.data.model.api.response.AuthData;
import com.algolovers.newsletterconsole.exceptions.OAuth2AuthenticationProcessingException;
import com.algolovers.newsletterconsole.service.JwtService;
import com.algolovers.newsletterconsole.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

@Component
@AllArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    final OAuth2StatelessAuthorizationRepository oAuth2StatelessAuthorizationRepository;
    final JwtService jwtService;
    final UserService userService;
    final ObjectMapper objectMapper;

    @SneakyThrows
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect");
            return;
        }

        super.clearAuthenticationAttributes(request);
        AuthenticatedUserToken authenticatedUserToken = userService.generateTokenForAuthenticatedUser(authentication, Optional.empty());
        User user = authenticatedUserToken.getUser();

        AuthData authData = AuthData
                .builder()
                .displayName(user.getDisplayName())
                .authorities(user.getAuthorities())
                .profilePicture(user.getProfilePicture())
                .token(authenticatedUserToken.getToken())
                .build();

        objectMapper.writeValueAsString(authData);

        try {
            String json = objectMapper.writeValueAsString(authData);
            String base64Url = Base64.getUrlEncoder().encodeToString(json.getBytes(StandardCharsets.UTF_8));
            getRedirectStrategy().sendRedirect(request, response, "/oauthSuccess?data=" + base64Url);
        } catch (IOException e) {
            e.printStackTrace();
            throw new OAuth2AuthenticationProcessingException("Could not generate OAuth authentication data");
        }

    }
}