package com.ordertracking.dto;

import com.ordertracking.model.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long id;
    private String trackingId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String itemName;
    private String itemDescription;
    private int quantity;
    private double totalAmount;
    private OrderStatus status;
    private LocalDateTime orderDate;
    private LocalDateTime dispatchedDate;
    private LocalDateTime inTransitDate;
    private LocalDateTime deliveredDate;
    private String notes;
}