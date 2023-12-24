package com.algolovers.newsletterconsole.data.model.api.response.auth;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Collection;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthData {
    @JsonProperty("displayName")
    String displayName;

    @JsonProperty("emailAddress")
    String emailAddress;

    @JsonProperty("authorities")
    Collection<Authority> authorities;

    @JsonProperty("profilePicture")
    String profilePicture;

    @JsonProperty("token")
    String token;
}
