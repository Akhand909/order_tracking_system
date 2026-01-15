-- Create admin user (password: admin123)
-- INSERT INTO admin_users (username, password, email, full_name, role) 
-- VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lOBslKohZi6HyS', 'admin@ordertracking.com', 'System Administrator', 'ADMIN');

-- Sample orders for testing
INSERT INTO customer_orders (tracking_id, customer_name, customer_email, customer_phone, shipping_address, item_name, item_description, quantity, total_amount, status, order_date, notes) 
VALUES 
('TRK7A3B9C1D', 'John Doe', 'john.doe@email.com', '+1234567890', '123 Main St, New York, NY 10001', 'Laptop', 'Dell XPS 15', 1, 1499.99, 'DELIVERED', '2024-01-10 10:30:00', 'Customer satisfied'),
('TRK2E4F8G0H', 'Jane Smith', 'jane.smith@email.com', '+0987654321', '456 Oak Ave, Los Angeles, CA 90001', 'Smartphone', 'iPhone 14 Pro', 2, 1998.00, 'IN_TRANSIT', '2024-01-12 14:45:00', 'Express shipping'),
('TRK5I6J7K8L', 'Bob Johnson', 'bob.j@email.com', '+1122334455', '789 Pine Rd, Chicago, IL 60601', 'Headphones', 'Sony WH-1000XM5', 1, 329.99, 'DISPATCHED', '2024-01-15 09:15:00', ''),
('TRK9M0N1O2P', 'Alice Brown', 'alice.b@email.com', '+5566778899', '321 Elm St, Houston, TX 77001', 'Tablet', 'iPad Air', 1, 599.99, 'PROCESSING', '2024-01-18 16:20:00', 'Backordered item'),
('TRK3Q4R5S6T', 'Charlie Wilson', 'charlie.w@email.com', '+9988776655', '654 Maple Dr, Phoenix, AZ 85001', 'Monitor', 'LG UltraGear 27"', 1, 449.99, 'OUT_FOR_DELIVERY', '2024-01-20 11:00:00', 'Fragile item');