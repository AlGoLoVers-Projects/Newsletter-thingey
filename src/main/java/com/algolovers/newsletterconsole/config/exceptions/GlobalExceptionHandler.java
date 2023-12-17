package com.algolovers.newsletterconsole.config.exceptions;

import com.algolovers.newsletterconsole.data.model.api.Result;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Result<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Result<String> result = new Result<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String errorMessage = error.getDefaultMessage();
            result.setSuccess(false);
            result.setMessage(errorMessage);
        });
        return ResponseEntity.badRequest().body(result);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Result<String>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        Result<String> result = new Result<>();
        // Customize the response for HttpMessageNotReadableException
        result.setSuccess(false);
        result.setMessage("Invalid request body. Please provide a valid JSON payload.");
        return ResponseEntity.badRequest().body(result);
    }

    @ExceptionHandler(SignatureException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<Result<String>> handleSignatureException(SignatureException ex) {
        Result<String> result = new Result<>();
        // Customize the response for SignatureException
        result.setSuccess(false);
        result.setMessage("JWT signature verification failed. Token validity cannot be asserted.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<Result<String>> handleExpiredJwt(ExpiredJwtException ex) {
        Result<String> result = new Result<>();
        // Customize the response for SignatureException
        result.setSuccess(false);
        result.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}

