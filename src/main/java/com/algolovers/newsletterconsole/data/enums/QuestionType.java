package com.algolovers.newsletterconsole.data.enums;

import com.algolovers.newsletterconsole.newsletter.engine.data.Type;
import lombok.Getter;

import java.util.Set;

@Getter
public enum QuestionType {
    TEXT(Type.TEXT),
    IMAGE(Type.IMAGE),
    DATE(Type.TEXT),
    TIME(Type.TEXT),
    CHECKBOX(Type.TEXT),
    DROPDOWN(Type.TEXT);

    public static final Set<QuestionType> multiOptionType = Set.of(CHECKBOX, DROPDOWN);

    private final Type type;
    QuestionType(Type type) {
        this.type = type;
    }

    public static boolean isMultipleOptionQuestion(QuestionType questionType) {
        return multiOptionType.contains(questionType);
    }
}
