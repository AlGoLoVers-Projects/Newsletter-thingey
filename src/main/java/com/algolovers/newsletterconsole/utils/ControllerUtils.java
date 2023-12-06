package com.algolovers.newsletterconsole.utils;

import com.algolovers.newsletterconsole.data.model.api.Result;
import org.springframework.http.ResponseEntity;

public class ControllerUtils {
    public static  <T> ResponseEntity<String> processResultForResponse(Result<T> result) {
        if (result.isSuccess()) {
            return ResponseEntity.ok(result.getMessage());
        } else {
            return ResponseEntity.badRequest().body(result.getMessage());
        }
    }
}
