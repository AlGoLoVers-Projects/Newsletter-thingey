package com.algolovers.newsletterconsole;

import com.algolovers.newsletterconsole.data.entity.user.User;
import com.algolovers.newsletterconsole.data.model.api.request.auth.UserCreationRequest;
import com.algolovers.newsletterconsole.service.data.GroupService;
import com.algolovers.newsletterconsole.service.data.UserService;
import org.antlr.v4.runtime.misc.Pair;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class NewsLetterConsoleApplicationTests {

    @MockBean
    GroupService groupService;

    @MockBean
    UserService userService;

    private static final String[] names = {"Liam", "Emma", "Noah", "Olivia", "William", "Ava", "James", "Isabella"};

    private static int randomNumber(int min, int max) {
        Random rand = new Random();
        return rand.nextInt((max - min) + 1) + min;
    }

    private static Pair<String, String> generateRandomUserNameAndEmailAddress() {
        String name = names[randomNumber(0, names.length - 1)];
        int randomNumber = randomNumber(100, 999);
		String emailAddress = (name + randomNumber + "@gmail.com").toLowerCase();

		return new Pair<>(name, emailAddress);
    }

    private User createNewUser() {
        UserCreationRequest userCreationRequest = new UserCreationRequest();
		Pair<String, String> userData = generateRandomUserNameAndEmailAddress();
        userCreationRequest.setUserName(userData.a);
		userCreationRequest.setEmail(userData.b);
		userCreationRequest.setPassword("Password123");

        return userService.provisionNewUser(userCreationRequest).getData();
    }


    @Test
    void testGroupCreation() {

    }


}
