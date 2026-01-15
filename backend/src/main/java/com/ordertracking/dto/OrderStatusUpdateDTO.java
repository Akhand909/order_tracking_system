package com.ordertracking.dto;

import lombok.Data;

@Data
public class OrderStatusUpdateDTO {
    private String status;
    private String notes;
}