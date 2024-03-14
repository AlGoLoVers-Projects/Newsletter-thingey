package com.algolovers.newsletterconsole;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.transaction.annotation.EnableTransactionManagement;

//TODO: Add cache, reduce data read from SQL
//TODO: Add date to make sure we don't publish for another 25 days
//TODO: Pull group whenever reloaded in group page to prevent inconsistency
//TODO: Make sure al orphan data is removed
//TODO: Completely deprecate cloudinary

@SpringBootApplication
@EnableTransactionManagement
@EnableCaching
public class NewsLetterConsoleApplication {

	//OAuth2: http://localhost:8080/oauth2/authorization/google
	public static void main(String[] args) {
		SpringApplication.run(NewsLetterConsoleApplication.class, args);
	}

}
