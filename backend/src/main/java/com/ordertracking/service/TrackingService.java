package com.ordertracking.service;

import com.ordertracking.dto.TrackingResponse;
import com.ordertracking.model.Order;
import com.ordertracking.model.OrderStatus;
import com.ordertracking.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.ordertracking.exception.OrderNotFoundException;

@Service
public class TrackingService {

    @Autowired
    private OrderRepository orderRepository;

    public TrackingResponse getOrderDetails(String trackingId) {
        Order order = orderRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with tracking ID: " + trackingId));

        TrackingResponse response = new TrackingResponse();
        response.setTrackingId(order.getTrackingId());
        response.setCustomerName(order.getCustomerName());
        response.setItemName(order.getItemName());
        response.setStatus(order.getStatus());
        response.setStatusDisplay(order.getStatus().getDisplayName());
        response.setOrderDate(order.getOrderDate());
        response.setNotes(order.getNotes());
        response.setCompanyName(order.getCompanyName());
        response.setCompanyAddress(order.getCompanyAddress());

        // Calculate last updated
        LocalDateTime lastUpdated = getLastUpdatedDate(order);
        response.setLastUpdated(lastUpdated);

        // Generate estimated delivery (example logic)
        response.setEstimatedDelivery(calculateEstimatedDelivery(order));

        // Generate current location based on status
        response.setCurrentLocation(getCurrentLocation(order.getStatus()));

        return response;
    }

    private LocalDateTime getLastUpdatedDate(Order order) {
        if (order.getDeliveredDate() != null)
            return order.getDeliveredDate();
        if (order.getInTransitDate() != null)
            return order.getInTransitDate();
        if (order.getDispatchedDate() != null)
            return order.getDispatchedDate();
        return order.getOrderDate();
    }

    private String calculateEstimatedDelivery(Order order) {
        LocalDateTime estimated = order.getOrderDate().plusDays(7); // Default 7 days
        if (order.getStatus() == OrderStatus.DELIVERED) {
            return "Delivered";
        } else if (order.getStatus() == OrderStatus.OUT_FOR_DELIVERY) {
            estimated = LocalDateTime.now().plusHours(4); // Today
        } else if (order.getStatus() == OrderStatus.IN_TRANSIT) {
            estimated = LocalDateTime.now().plusDays(3); // 3 days from now
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        return estimated.format(formatter);
    }

    private String getCurrentLocation(OrderStatus status) {
        switch (status) {
            case PROCESSING:
                return "Warehouse - Processing";
            case CONFIRMED:
                return "Warehouse - Confirmed";
            case DISPATCHED:
                return "Distribution Center";
            case IN_TRANSIT:
                return "In Transit - Main Hub";
            case OUT_FOR_DELIVERY:
                return "Local Delivery Center";
            case DELIVERED:
                return "Delivered to Customer";
            default:
                return "Processing Center";
        }
    }
}