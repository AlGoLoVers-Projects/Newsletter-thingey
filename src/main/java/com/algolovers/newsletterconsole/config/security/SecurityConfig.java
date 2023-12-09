package com.algolovers.newsletterconsole.config.security;

import com.algolovers.newsletterconsole.config.security.oauth.OAuth2FailureHandler;
import com.algolovers.newsletterconsole.config.security.oauth.OAuth2StatelessAuthorizationRepository;
import com.algolovers.newsletterconsole.config.security.oauth.OAuth2SuccessHandler;
import com.algolovers.newsletterconsole.service.CustomOAuth2UserService;
import com.algolovers.newsletterconsole.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    final PasswordEncoder passwordEncoder;
    final UserService userDetailsService;
    final AuthEntryPoint authEntryPoint;
    final TokenAuthenticationFilter tokenAuthenticationFilter;
    final OAuth2StatelessAuthorizationRepository oAuth2StatelessAuthorizationRepository;
    final CustomOAuth2UserService customOAuth2UserService;
    final OAuth2SuccessHandler oAuth2SuccessHandler;
    final OAuth2FailureHandler oAuth2FailureHandler;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(new RestAuthenticationEntryPoint()))
                .sessionManagement((sessionManagement) -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/",
                                "/error",
                                "/notFound",
                                "/favicon.ico",
                                "/api/auth/**",
                                "/oauth2/**",
                                "/login/**",
                                "/**/*.png",
                                "/**/*.gif",
                                "/**/*.svg",
                                "/**/*.jpg",
                                "/**/*.html",
                                "/**/*.css",
                                "/**/*.js")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .oauth2Login(config -> {
                    config.authorizationEndpoint(authConfig -> {
                        authConfig.authorizationRequestRepository(oAuth2StatelessAuthorizationRepository); //Required auth values are stored in cookie for stateless processing
                    });
                    config.redirectionEndpoint(redirectionEndpointConfig -> redirectionEndpointConfig.baseUri("/oauth2/callback/*")); //Redirects back to this URL, receive all
                    config.userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig.userService(customOAuth2UserService)); //Reaches this point when user is authorized and user info is fetched, user saving is done her
                    config.successHandler(oAuth2SuccessHandler); //handle success, set cookie, redirect.
                    config.failureHandler(oAuth2FailureHandler); //handle failure, clear cookie, redirect to login
                })
                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "responseType", "Authorization"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}
