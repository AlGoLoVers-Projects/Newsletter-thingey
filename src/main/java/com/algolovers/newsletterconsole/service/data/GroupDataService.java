package com.algolovers.newsletterconsole.service.data;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupDataService {

    private final GroupRepository groupRepository;

    public Optional<Group> findById(String id) {
        return groupRepository.findById(id);
    }

    public Group save(Group group) {
        return groupRepository.save(group);
    }

    public void delete(Group group) {
        groupRepository.delete(group);
    }

}
