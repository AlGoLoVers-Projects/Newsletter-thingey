package com.algolovers.newsletterconsole.service.cache;

import com.algolovers.newsletterconsole.data.entity.groups.Group;
import com.algolovers.newsletterconsole.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupCacheService {

    private final GroupRepository groupRepository;

    @Cacheable(value = "groupCache", key = "#id")
    public Optional<Group> findById(String id) {
        return groupRepository.findById(id);
    }

    @Caching(put = @CachePut(value = "groupCache", key = "#group.id"))
    @CachePut(value = "groupCache", key = "#group.id")
    public Group save(Group group) {
        return groupRepository.save(group);
    }

    @Caching(evict = @CacheEvict(value = "groupCache", key = "#group.id"))
    public void delete(Group group) {
        groupRepository.delete(group);
    }

}
