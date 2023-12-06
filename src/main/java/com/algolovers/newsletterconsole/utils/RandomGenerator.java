package com.algolovers.newsletterconsole.utils;

import java.util.Random;
import java.util.UUID;

public class RandomGenerator {

    public static long generateRandomCode() {
        Random random = new Random();
        long lowerBound = 10000000L;
        long upperBound = 99999999L;

        return lowerBound + random.nextInt((int) (upperBound - lowerBound + 1));
    }

    public static String generateRandomToken(Integer maxLength) {
        String uuid = UUID.randomUUID().toString();
        String token = uuid.replaceAll("-", "");
        return token.substring(0, maxLength);
    }

}
