package com.ordertracking.repository;

import com.ordertracking.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByTrackingId(String trackingId);
    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findByStatus(String status);
    List<Order> findByCustomerEmail(String email);
}