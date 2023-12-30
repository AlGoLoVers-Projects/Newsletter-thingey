package com.algolovers.newsletterconsole.data.enums;

import java.util.Set;

public enum QuestionType {
    TEXT,
    IMAGE,
    DATE,
    TIME,
    RADIO,
    CHECKBOX,
    DROPDOWN_SINGLE,
    DROPDOWN_MULTIPLE;

    public static final Set<QuestionType> multiOptionType = Set.of(RADIO, CHECKBOX, DROPDOWN_SINGLE, DROPDOWN_MULTIPLE);

    public static boolean isMultipleOptionQuestion(QuestionType questionType) {
        return multiOptionType.contains(questionType);
    }
}
