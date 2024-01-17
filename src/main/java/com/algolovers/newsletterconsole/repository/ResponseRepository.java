package com.algolovers.newsletterconsole.repository;

import com.algolovers.newsletterconsole.data.entity.reponse.ResponseData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponseRepository extends JpaRepository<ResponseData, String> {

}
