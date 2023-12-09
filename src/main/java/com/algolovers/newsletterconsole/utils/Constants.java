package com.algolovers.newsletterconsole.utils;

import java.util.List;

public class Constants {
    public static final String AUTH_COOKIE_KEY = "newsletter-auth-cookie";
    public static final String OAUTH_COOKIE_NAME = "newsletter-google-oauth-cookie";
    public static final List<String> UNAUTHORIZED_NONSTATIC_API = List.of("/api", "/oauth2", "/static");
}
