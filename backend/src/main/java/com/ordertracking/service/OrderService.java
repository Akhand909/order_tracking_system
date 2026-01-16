package com.ordertracking.service;

import com.ordertracking.dto.OrderDTO;
import com.ordertracking.dto.OrderStatusUpdateDTO;
import com.ordertracking.model.Order;
import com.ordertracking.model.OrderStatus;
import com.ordertracking.repository.OrderRepository;

import lombok.NonNull;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public OrderDTO createOrder(@NonNull OrderDTO orderDTO) {
        Order order = new Order();
        BeanUtils.copyProperties(orderDTO, order);

        // Generate Tracking ID
        order.setTrackingId("TRK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PROCESSING);

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderByTrackingId(String trackingId) {
        Order order = orderRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new RuntimeException("Order not found with tracking ID: " + trackingId));
        return convertToDTO(order);
    }

    public OrderDTO updateOrderStatus(@NonNull String id, OrderStatusUpdateDTO statusUpdate) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));

        OrderStatus newStatus = OrderStatus.valueOf(statusUpdate.getStatus());
        order.setStatus(newStatus);

        // Update timestamps based on status
        switch (newStatus) {
            case DISPATCHED:
                order.setDispatchedDate(LocalDateTime.now());
                break;
            case IN_TRANSIT:
                order.setInTransitDate(LocalDateTime.now());
                break;
            case OUT_FOR_DELIVERY:
            case CANCELLED:
            case CONFIRMED:
            case PROCESSING:
                // No specific timestamp for this
                break;
            case DELIVERED:
                order.setDeliveredDate(LocalDateTime.now());
                break;
        }

        if (statusUpdate.getNotes() != null) {
            order.setNotes(statusUpdate.getNotes());
        }

        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    public OrderDTO getOrderById(@NonNull String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
        return convertToDTO(order);
    }

    @SuppressWarnings("null")
    public void deleteOrder(@NonNull String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
        orderRepository.delete(order);
    }

    private OrderDTO convertToDTO(@NonNull Order order) {
        OrderDTO dto = new OrderDTO();
        BeanUtils.copyProperties(order, dto);
        return dto;
    }
}