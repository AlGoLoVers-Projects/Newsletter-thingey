package com.algolovers.newsletterconsole.utils;

import com.algolovers.newsletterconsole.data.model.api.Result;
import org.springframework.http.ResponseEntity;

public class ControllerUtils {
    public static <T> ResponseEntity<Result<String>> processResultForResponse(Result<T> result) {
        if (result.isSuccess()) {
            return ResponseEntity.ok(new Result<>(true, null, result.getMessage()));
        } else {
            return ResponseEntity.badRequest().body(new Result<>(false, null, result.getMessage()));
        }
    }

    public static <T> ResponseEntity<Result<T>> processResultForResponseWithData(Result<T> result) {
        if (result.isSuccess()) {
            return ResponseEntity.ok(new Result<>(true, result.getData(), result.getMessage()));
        } else {
            return ResponseEntity.badRequest().body(new Result<>(false, result.getData(), result.getMessage()));
        }
    }
}
