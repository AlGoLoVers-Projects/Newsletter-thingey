package com.algolovers.newsletterconsole.data.model.api.response;

import com.algolovers.newsletterconsole.data.entity.user.Authority;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.context.annotation.Bean;

import java.util.Collection;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    @JsonProperty("displayName")
    String displayName;

    @JsonProperty("authorities")
    Collection<Authority> authorities;

    @JsonProperty("profilePicture")
    String profilePicture;

    @JsonProperty("token")
    String token;
}
