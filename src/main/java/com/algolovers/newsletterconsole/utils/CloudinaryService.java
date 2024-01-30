package com.algolovers.newsletterconsole.utils;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${spring.cloudinary.cloud-name}")
    private String cloudName;

    @Value("${spring.cloudinary.api-key}")
    private String apiKey;

    @Value("${spring.cloudinary.api-secret}")
    private String apiSecret;

    public CloudinaryService() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));

    }

    public String uploadImage(File file, String imageName) {
        try {
            Map map = cloudinary
                    .uploader()
                    .upload(file, ObjectUtils.asMap("public_id", imageName));

            return (String) map.get("url");
        } catch (IOException e) {
            log.error("Failed to upload image", e);
            throw new RuntimeException(e);
        }
    }
}
