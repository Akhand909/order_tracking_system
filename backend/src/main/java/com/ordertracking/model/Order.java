package com.ordertracking.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "customer_orders")
@Data
public class Order {

    @Id
    private String id;

    @Field
    private String trackingId;

    @Field
    private String customerName;

    @Field
    private String customerEmail;

    @Field
    private String customerPhone;

    @Field
    private String shippingAddress;

    @Field
    private String companyName;

    @Field
    private String companyAddress;

    @Field
    private String itemName;

    @Field
    private String itemDescription;

    @Field
    private int quantity;

    @Field
    private double totalAmount;

    @Field
    private OrderStatus status;

    @Field
    private LocalDateTime orderDate;

    private LocalDateTime dispatchedDate;
    private LocalDateTime inTransitDate;
    private LocalDateTime deliveredDate;

    @Field
    private String notes;

    public Order() {
        this.status = OrderStatus.PROCESSING;
    }
}