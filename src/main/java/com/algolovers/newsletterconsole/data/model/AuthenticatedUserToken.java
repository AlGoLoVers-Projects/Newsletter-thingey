package com.algolovers.newsletterconsole.data.model;

import com.algolovers.newsletterconsole.data.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthenticatedUserToken {
    User user;
    String token;
}
