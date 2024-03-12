package com.algolovers.newsletterconsole.newsletter.engine.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PDFElement {
    String question;
    String userName;
    String profilePicture;
    Type type;
    String response;
}
