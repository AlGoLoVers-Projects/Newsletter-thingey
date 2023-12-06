package com.algolovers.newsletterconsole.data.model.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@ToString
public class LoginResponse {
    @JsonProperty("token")
    String token;

    @JsonProperty("displayName")
    String displayName;
}
