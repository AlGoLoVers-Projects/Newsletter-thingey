package com.algolovers.newsletterconsole.data.model.api.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationRequest {
    @NotEmpty
    String userName;
    @NotEmpty
    String password;
    @NotEmpty
    String emailAddress;
}
