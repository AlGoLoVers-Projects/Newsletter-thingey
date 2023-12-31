package com.algolovers.newsletterconsole.data.entity.converter;

import com.algolovers.newsletterconsole.data.entity.reponse.QuestionResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Set;

@Converter
public class QuestionResponseSetConverter implements AttributeConverter<Set<QuestionResponse>, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Set<QuestionResponse> questionResponses) {
        if (questionResponses == null || questionResponses.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(questionResponses);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting Set<QuestionResponse> to JSON", e);
        }
    }

    @Override
    public Set<QuestionResponse> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.readValue(dbData, new TypeReference<Set<QuestionResponse>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to Set<QuestionResponse>", e);
        }
    }
}
