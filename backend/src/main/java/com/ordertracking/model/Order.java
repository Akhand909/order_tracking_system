package com.ordertracking.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customer_orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String trackingId;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String customerPhone;

    @Column(nullable = false)
    private String shippingAddress;

    @Column
    private String companyName;

    @Column
    private String companyAddress;

    @Column(nullable = false)
    private String itemName;

    private String itemDescription;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    private LocalDateTime dispatchedDate;
    private LocalDateTime inTransitDate;
    private LocalDateTime deliveredDate;

    @Column(length = 500)
    private String notes;

    @PrePersist
    protected void onCreate() {
        this.trackingId = "TRK" + UUID.randomUUID().toString()
                .substring(0, 8).toUpperCase();
        this.orderDate = LocalDateTime.now();
        this.status = OrderStatus.PROCESSING;
    }
}