package com.ordertracking.repository;

import com.ordertracking.model.AdminUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends MongoRepository<AdminUser, String> {
    Optional<AdminUser> findByUsername(String username);

    Optional<AdminUser> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}