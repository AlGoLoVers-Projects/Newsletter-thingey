package com.algolovers.newsletterconsole.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

}
