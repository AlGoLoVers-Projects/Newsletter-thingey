package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    //TODO: Add methods: Create new team (by authorised user), add user -> invitation. Send invitation, accept invitation.

}
