package com.algolovers.newsletterconsole.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.cache.transaction.TransactionAwareCacheManagerProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration

public class CacheManagerConfig {

    public static final String USER_CACHE = "userCache";
    public static final String USER_ID_CACHE = "userIdCache";
    public static final String GROUP_CACHE = "groupCache";

    @Bean
    public CacheManager cacheConfig() {

        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(List.of(new ConcurrentMapCache(USER_CACHE), new ConcurrentMapCache(USER_ID_CACHE), new ConcurrentMapCache(GROUP_CACHE)));
        cacheManager.initializeCaches();

        return new TransactionAwareCacheManagerProxy(cacheManager);
    }
}