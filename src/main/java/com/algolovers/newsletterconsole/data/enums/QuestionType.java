package com.algolovers.newsletterconsole.data.enums;

import java.util.Set;

public enum QuestionType {
    TEXT,
    IMAGE,
    DATE,
    TIME,
    CHECKBOX,
    DROPDOWN;

    public static final Set<QuestionType> multiOptionType = Set.of(CHECKBOX, DROPDOWN);

    public static boolean isMultipleOptionQuestion(QuestionType questionType) {
        return multiOptionType.contains(questionType);
    }
}
