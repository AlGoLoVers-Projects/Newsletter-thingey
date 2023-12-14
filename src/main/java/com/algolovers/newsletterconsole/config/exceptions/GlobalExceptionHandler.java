package com.algolovers.newsletterconsole.config.exceptions;

import com.algolovers.newsletterconsole.data.model.api.Result;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class, SignatureException.class})
    public ResponseEntity<Result<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Result<String> result = new Result<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String errorMessage = error.getDefaultMessage();
            result.setSuccess(false);
            result.setMessage(errorMessage);
        });
        return ResponseEntity.badRequest().body(result);
    }
}
