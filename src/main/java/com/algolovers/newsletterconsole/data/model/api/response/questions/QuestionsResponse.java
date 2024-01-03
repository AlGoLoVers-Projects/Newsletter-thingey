package com.algolovers.newsletterconsole.data.model.api.response.questions;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.data.entity.questions.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionsResponse {
    List<Question> questions;
    Group group;
    Boolean questionsAlreadyTaken;
}
