package com.algolovers.newsletterconsole.config.security;

import com.algolovers.newsletterconsole.data.model.api.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Component
@AllArgsConstructor
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException e) throws IOException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Result<String> result = Result.<String>builder()
                .success(false)
                .message(e.getMessage())
                .data("Authentication failed, token missing / api not found")
                .build();

        String jsonResponse = objectMapper.writeValueAsString(result);

        try (PrintWriter writer = response.getWriter()) {
            writer.write(jsonResponse);
        }
    }

}

