package com.algolovers.newsletterconsole.newsletter.engine.data;

import lombok.Data;

@Data
public class PDFElement {
    String question;
    String userName;
    Type type;
    String response;
}
