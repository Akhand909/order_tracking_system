import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../shared/services/order.service';
import { Order, OrderStatusUpdate } from '../../../shared/models/order.model';

@Component({
    selector: 'app-update-status',
    templateUrl: './update-status.component.html',
    styleUrls: ['./update-status.component.css']
})
export class UpdateStatusComponent implements OnInit {
    orderId!: string;
    order: Order | null = null;
    statusForm: FormGroup;
    isLoading = true;
    isUpdating = false;
    errorMessage = '';
    successMessage = '';

    statusOptions = [
        { value: 'PROCESSING', label: 'Processing', icon: 'fas fa-cogs', color: 'warning' },
        { value: 'CONFIRMED', label: 'Confirmed', icon: 'fas fa-check-circle', color: 'info' },
        { value: 'DISPATCHED', label: 'Dispatched', icon: 'fas fa-truck-loading', color: 'primary' },
        { value: 'IN_TRANSIT', label: 'In Transit', icon: 'fas fa-shipping-fast', color: 'info' },
        { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'fas fa-truck', color: 'warning' },
        { value: 'DELIVERED', label: 'Delivered', icon: 'fas fa-home', color: 'success' },
        { value: 'CANCELLED', label: 'Cancelled', icon: 'fas fa-times-circle', color: 'danger' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private orderService: OrderService
    ) {
        this.statusForm = this.fb.group({
            status: ['', Validators.required],
            notes: ['']
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.orderId = params['id'];
            this.loadOrder();
        });
    }

    loadOrder(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.orderService.getOrderById(this.orderId).subscribe({
            next: (order) => {
                this.order = order;
                this.statusForm.patchValue({
                    status: order.status,
                    notes: order.notes || ''
                });
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to load order details.';
                console.error('Error loading order:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.statusForm.invalid || !this.order) {
            return;
        }

        this.isUpdating = true;
        this.successMessage = '';
        this.errorMessage = '';

        const statusUpdate: OrderStatusUpdate = {
            status: this.statusForm.get('status')?.value,
            notes: this.statusForm.get('notes')?.value
        };

        this.orderService.updateOrderStatus(this.orderId, statusUpdate).subscribe({
            next: (updatedOrder) => {
                this.order = updatedOrder;
                this.isUpdating = false;
                this.successMessage = 'Order status updated successfully!';

                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            },
            error: (error) => {
                this.isUpdating = false;
                this.errorMessage = 'Failed to update order status. Please try again.';
                console.error('Error updating status:', error);
            }
        });
    }

    getStatusColor(status: string): string {
        return this.orderService.getStatusColor(status);
    }

    getStatusText(status: string): string {
        return this.orderService.getStatusText(status);
    }

    formatDate(dateString: string): string {
        return this.orderService.formatDate(dateString);
    }

    formatCurrency(amount: number): string {
        return this.orderService.formatCurrency(amount);
    }

    viewCustomerTracking(): void {
        if (this.order) {
            this.router.navigate(['/customer/details', this.order.trackingId]);
        }
    }

    backToOrders(): void {
        this.router.navigate(['/admin/orders']);
    }

    getStatusIcon(status: string): string {
        const option = this.statusOptions.find(opt => opt.value === status);
        return option?.icon || 'fas fa-box';
    }

    getStatusColorClass(status: string): string {
        const option = this.statusOptions.find(opt => opt.value === status);
        return option?.color || 'secondary';
    }
}