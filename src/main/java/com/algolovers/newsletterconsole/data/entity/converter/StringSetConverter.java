package com.algolovers.newsletterconsole.data.entity.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Converter
public class StringSetConverter implements AttributeConverter<Set<String>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Set<String> stringSet) {
        try {
            return objectMapper.writeValueAsString(stringSet);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting Set<String> to JSON", e);
        }
    }

    @Override
    public Set<String> convertToEntityAttribute(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return new HashSet<>();
        }

        try {
            return objectMapper.readValue(jsonString, new TypeReference<HashSet<String>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Error converting JSON to Set<String>", e);
        }
    }
}
