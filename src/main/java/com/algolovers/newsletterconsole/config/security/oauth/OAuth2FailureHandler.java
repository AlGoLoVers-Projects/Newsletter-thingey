package com.algolovers.newsletterconsole.config.security.oauth;

import com.algolovers.newsletterconsole.utils.CookieHelper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

import static com.algolovers.newsletterconsole.utils.Constants.OAUTH_COOKIE_NAME;

@Component
@AllArgsConstructor
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    OAuth2StatelessAuthorizationRepository oAuth2StatelessAuthorizationRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        CookieHelper.clearCookie(response, OAUTH_COOKIE_NAME);
        getRedirectStrategy().sendRedirect(request, response, "/oAuth2Error?exception=" + exception.getMessage());
    }

}