package com.algolovers.newsletterconsole.utils;

import jakarta.servlet.http.Cookie;
import lombok.NonNull;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Optional;

import static java.util.Objects.isNull;

public class CookieHelper {

    private static final Boolean HTTP_ONLY = Boolean.TRUE;
    private static final Boolean SECURE = Boolean.FALSE;

    public static Optional<String> retrieve(Cookie[] cookies, @NonNull String name) {
        if (isNull(cookies)) {
            return Optional.empty();
        }
        for (Cookie cookie : cookies) {
            if (cookie.getName().equalsIgnoreCase(name)) {
                return Optional.ofNullable(URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8));
            }
        }
        return Optional.empty();
    }

    public static Cookie generateCookie(@NonNull String name, @NonNull String value, @NonNull Duration maxAge) {
        Cookie cookie = new Cookie(name, URLEncoder.encode(value, StandardCharsets.UTF_8));
        cookie.setHttpOnly(HTTP_ONLY);
        cookie.setSecure(SECURE);
        cookie.setMaxAge((int) maxAge.toSeconds());
        cookie.setPath("/");

        return cookie;
    }

    public static Cookie generateExpiredCookie(@NonNull String name) {
        return generateCookie(name, "", Duration.ZERO);
    }

}
