package com.algolovers.newsletterconsole.utils;

import java.util.Random;

public class RandomGenerator {

    public static long generateRandomCode() {
        Random random = new Random();
        long lowerBound = 10000000L;
        long upperBound = 99999999L;

        return lowerBound + random.nextInt((int) (upperBound - lowerBound + 1));
    }

}
