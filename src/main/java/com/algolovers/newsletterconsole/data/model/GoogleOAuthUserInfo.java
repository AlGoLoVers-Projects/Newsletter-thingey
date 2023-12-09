package com.algolovers.newsletterconsole.data.model;

import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class GoogleOAuthUserInfo {
    protected Map<String, Object> attributes;

    public String getId() {
        return (String) attributes.get("sub");
    }

    public String getName() {
        return (String) attributes.get("name");
    }

    public String getEmail() {
        return (String) attributes.get("email");
    }

    public String getImageUrl() {
        return (String) attributes.get("picture");
    }
}

