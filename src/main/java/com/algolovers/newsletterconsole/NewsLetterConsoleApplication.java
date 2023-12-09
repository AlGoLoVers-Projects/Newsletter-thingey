package com.algolovers.newsletterconsole;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class NewsLetterConsoleApplication {

	//OAuth2: http://localhost:8080/oauth2/authorization/google
	//TODO: Use allArgsConstructor for injection
	//TODO: Improve cookie handling
	//TODO: Clear all cookies in case of login or failures
	//TODO: Make user authorities a JSON string
	public static void main(String[] args) {
		SpringApplication.run(NewsLetterConsoleApplication.class, args);
	}

}
