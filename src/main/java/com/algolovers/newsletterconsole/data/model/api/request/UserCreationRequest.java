package com.algolovers.newsletterconsole.data.model.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationRequest {
    String userName;
    String password;
    String emailAddress;
}
