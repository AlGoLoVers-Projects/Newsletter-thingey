package com.algolovers.newsletterconsole.data.entity.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Converter
public class AuthoritySetConverter implements AttributeConverter<Set<Authority>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Set<Authority> authorities) {
        try {
            return objectMapper.writeValueAsString(authorities);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting Set<Authority> to JSON", e);
        }
    }

    @Override
    public Set<Authority> convertToEntityAttribute(String json) {
        if (json == null || json.isEmpty()) {
            return new HashSet<>();
        }

        try {
            return objectMapper.readValue(json, objectMapper.getTypeFactory().constructCollectionType(Set.class, Authority.class));
        } catch (IOException e) {
            throw new RuntimeException("Error converting JSON to Set<Authority>", e);
        }
    }
}
