package com.ordertracking.controller;

import com.ordertracking.dto.TrackingResponse;
import com.ordertracking.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {
    
    @Autowired
    private TrackingService trackingService;
    
    @GetMapping("/track/{trackingId}")
    public ResponseEntity<TrackingResponse> trackOrder(@PathVariable String trackingId) {
        return ResponseEntity.ok(trackingService.getOrderDetails(trackingId));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Customer API is healthy");
    }
}