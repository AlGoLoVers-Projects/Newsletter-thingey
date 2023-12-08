package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.algolovers.newsletterconsole.data.entity.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static com.algolovers.newsletterconsole.utils.Constants.COOKIE_KEY;

@Component
public class JwtService {

    @Value("${newsletter.jwt.secret}")
    private String SECRET;
    public static final String VALIDITY_CODE_KEY = "validityCode";
    final UserService userService;

    public JwtService(UserService userService) {
        this.userService = userService;
    }

    public String getUserIdFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, User user) {
        final String id = getUserIdFromToken(token);
        final String validityCode = extractAllClaims(token).get(VALIDITY_CODE_KEY, String.class);
        return (id.equals(user.getId()) && !isTokenExpired(token) && validityCode.equals(user.getAccountValidityCode()));
    }

    public Cookie generateCookie(User user, String validityCode) {
        String token = generateToken(user, validityCode);

        Cookie cookie = new Cookie(COOKIE_KEY, URLEncoder.encode("Bearer " + token, StandardCharsets.UTF_8));
        cookie.setHttpOnly(true);
        cookie.setMaxAge(12 * 60 * 60);
        cookie.setPath("/");

        return cookie;
    }

    public String generateToken(User user, String validityCode) {
        Map<String, Object> claims = new HashMap<>();
        Collection<Authority> authorities = user.getAuthorities();
        if (authorities.contains(Authority.ADMIN)) {
            claims.put(Authority.ADMIN.getAuthority(), true);
        }
        if (authorities.contains(Authority.USER)) {
            claims.put(Authority.USER.getAuthority(), true);
        }

        claims.put(VALIDITY_CODE_KEY, validityCode);
        return createToken(claims, user.getId());
    }


    private String createToken(Map<String, Object> claims, String id) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(id)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
