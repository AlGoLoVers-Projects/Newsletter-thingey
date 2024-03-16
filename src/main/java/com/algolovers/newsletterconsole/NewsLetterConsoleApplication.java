package com.algolovers.newsletterconsole;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.hazelcast.HazelcastAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication(exclude = HazelcastAutoConfiguration.class)
@EnableTransactionManagement
@EnableCaching
public class NewsLetterConsoleApplication {

	//OAuth2: http://localhost:8080/oauth2/authorization/google
	public static void main(String[] args) {
		SpringApplication.run(NewsLetterConsoleApplication.class, args);
	}

}
