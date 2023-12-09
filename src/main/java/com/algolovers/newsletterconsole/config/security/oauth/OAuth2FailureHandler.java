package com.algolovers.newsletterconsole.config.security.oauth;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@AllArgsConstructor
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    OAuth2StatelessAuthorizationRepository oAuth2StatelessAuthorizationRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        response.addCookie(oAuth2StatelessAuthorizationRepository.removeAuthorizationRequestCookies());
        getRedirectStrategy().sendRedirect(request, response, "/oAuth2Error?exception=" + exception.getMessage());
    }

}