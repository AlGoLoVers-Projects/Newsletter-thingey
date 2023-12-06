package com.algolovers.newsletterconsole.data.model.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Result<T> {
    private boolean success;
    private T data;
    private String message;
}
