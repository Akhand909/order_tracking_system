package com.ordertracking.dto;

import com.ordertracking.model.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TrackingResponse {
    private String trackingId;
    private String customerName;
    private String itemName;
    private OrderStatus status;
    private String statusDisplay;
    private LocalDateTime orderDate;
    private LocalDateTime lastUpdated;
    private String currentLocation;
    private String estimatedDelivery;
    private String notes;
    private String companyName;
    private String companyAddress;

    public TrackingResponse() {
        this.statusDisplay = status != null ? status.getDisplayName() : "";
    }
}