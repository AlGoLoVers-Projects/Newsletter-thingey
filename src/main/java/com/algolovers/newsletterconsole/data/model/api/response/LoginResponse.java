package com.algolovers.newsletterconsole.data.model.api.response;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.ToString;

import java.util.Collection;
import java.util.Set;

@AllArgsConstructor
@ToString
public class LoginResponse {
    @JsonProperty("token")
    String token;

    @JsonProperty("displayName")
    String displayName;

    @JsonProperty("authorities")
    Collection<Authority> authorities;
}
