package com.algolovers.newsletterconsole.config.security.oauth;

import com.algolovers.newsletterconsole.utils.CookieHelper;
import com.algolovers.newsletterconsole.utils.EncryptionHelper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Base64;

import static com.algolovers.newsletterconsole.utils.Constants.OAUTH_COOKIE_NAME;

@Component
public class OAuth2StatelessAuthorizationRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    private static final Duration OAUTH_COOKIE_EXPIRY = Duration.ofMinutes(5);
    private static final Base64.Encoder B64E = Base64.getEncoder();
    private static final Base64.Decoder B64D = Base64.getDecoder();

    private final SecretKey encryptionKey;

    public OAuth2StatelessAuthorizationRepository() {
        this.encryptionKey = EncryptionHelper.generateKey();
    }

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return this.retrieveCookie(request);
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, HttpServletResponse response) {
        if (authorizationRequest == null) {
            this.removeCookie(response);
            return;
        }
        this.attachCookie(response, authorizationRequest);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
        return this.retrieveCookie(request);
    }

    private OAuth2AuthorizationRequest retrieveCookie(HttpServletRequest request) {
        return CookieHelper.retrieve(request.getCookies(), OAUTH_COOKIE_NAME)
                .map(this::decrypt)
                .orElse(null);
    }

    private void attachCookie(HttpServletResponse response, OAuth2AuthorizationRequest value) {
        Cookie cookie = CookieHelper.generateCookie(OAUTH_COOKIE_NAME, this.encrypt(value), OAUTH_COOKIE_EXPIRY);
        response.addCookie(cookie);
    }

    private void removeCookie(HttpServletResponse response) {
        Cookie expiredCookie = CookieHelper.generateExpiredCookie(OAUTH_COOKIE_NAME);
        response.addCookie(expiredCookie);
    }

    private String encrypt(OAuth2AuthorizationRequest authorizationRequest) {
        byte[] bytes = SerializationUtils.serialize(authorizationRequest);
        byte[] encryptedBytes = EncryptionHelper.encrypt(this.encryptionKey, bytes);
        return B64E.encodeToString(encryptedBytes);
    }

    private OAuth2AuthorizationRequest decrypt(String encrypted) {
        byte[] encryptedBytes = B64D.decode(encrypted);
        byte[] bytes = EncryptionHelper.decrypt(this.encryptionKey, encryptedBytes);
        return (OAuth2AuthorizationRequest) SerializationUtils.deserialize(bytes);
    }
}