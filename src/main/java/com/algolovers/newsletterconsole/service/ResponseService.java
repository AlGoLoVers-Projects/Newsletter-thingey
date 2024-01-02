package com.algolovers.newsletterconsole.service;

import com.algolovers.newsletterconsole.repository.GroupRepository;
import com.algolovers.newsletterconsole.repository.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResponseService {
    private final GroupRepository groupRepository;
    private final ResponseRepository responseRepository;



}
