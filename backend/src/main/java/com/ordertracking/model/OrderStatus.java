package com.ordertracking.model;

public enum OrderStatus {
    PROCESSING("Processing"),
    CONFIRMED("Confirmed"),
    DISPATCHED("Dispatched"),
    IN_TRANSIT("In Transit"),
    OUT_FOR_DELIVERY("Out for Delivery"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled");
    
    private final String displayName;
    
    OrderStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}