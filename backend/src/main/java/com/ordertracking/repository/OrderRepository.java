package com.ordertracking.repository;

import com.ordertracking.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    Optional<Order> findByTrackingId(String trackingId);

    List<Order> findAllByOrderByOrderDateDesc();

    List<Order> findByStatus(String status);

    List<Order> findByCustomerEmail(String email);
}