package com.algolovers.newsletterconsole.newsletter.engine.data;

import lombok.Data;

import java.util.List;

@Data
public class PDFData {
    List<PDFElement> pdfElementList;
    String dateOfGeneration;
    String groupTitle;
    String groupDescription;
}