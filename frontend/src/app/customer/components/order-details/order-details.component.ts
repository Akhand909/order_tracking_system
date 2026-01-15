import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { TrackingResponse } from '../../../shared/models/tracking.model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  trackingId: string = '';
  orderDetails: TrackingResponse | null = null;
  isLoading = true;
  errorMessage = '';
  autoRefreshEnabled = false;
  autoRefreshSubscription: Subscription | null = null;
  lastUpdated: string = '';

  // Progress steps
  progressSteps = [
    { status: 'PROCESSING', label: 'Processing', icon: 'fas fa-box-open' },
    { status: 'CONFIRMED', label: 'Confirmed', icon: 'fas fa-check-circle' },
    { status: 'DISPATCHED', label: 'Dispatched', icon: 'fas fa-truck-loading' },
    { status: 'IN_TRANSIT', label: 'In Transit', icon: 'fas fa-shipping-fast' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'fas fa-truck' },
    { status: 'DELIVERED', label: 'Delivered', icon: 'fas fa-home' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.trackingId = params['trackingId'];
      this.loadOrderDetails();
    });
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.trackOrder(this.trackingId).subscribe({
      next: (response) => {
        this.orderDetails = response;
        this.isLoading = false;
        this.lastUpdated = new Date().toLocaleTimeString();

        // Start auto-refresh if enabled
        if (this.autoRefreshEnabled) {
          this.startAutoRefresh();
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.errorMessage = `Order with tracking ID "${this.trackingId}" not found.`;
        } else {
          this.errorMessage = 'An error occurred while loading order details.';
        }
      }
    });
  }

  getActiveStepIndex(): number {
    if (!this.orderDetails) return 0;

    const statusIndex = this.progressSteps.findIndex(
      step => step.status === this.orderDetails?.status
    );
    return statusIndex >= 0 ? statusIndex : 0;
  }

  getProgressPercentage(): number {
    const activeIndex = this.getActiveStepIndex();
    return (activeIndex / (this.progressSteps.length - 1)) * 100;
  }

  toggleAutoRefresh(): void {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;

    if (this.autoRefreshEnabled) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  startAutoRefresh(): void {
    this.stopAutoRefresh();

    // Refresh every 30 seconds
    this.autoRefreshSubscription = interval(30000).subscribe(() => {
      this.loadOrderDetails();
    });
  }

  stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
  }

  getStatusColor(status: string): string {
    return this.orderService.getStatusColor(status);
  }

  getStatusText(status: string): string {
    return this.orderService.getStatusText(status);
  }

  getStatusIcon(status: string): string {
    const step = this.progressSteps.find(s => s.status === status);
    return step ? step.icon.replace('fas fa-', '') : 'info-circle';
  }

  formatDate(dateString: string): string {
    return this.orderService.formatDate(dateString);
  }

  trackAnotherOrder(): void {
    this.router.navigate(['/customer/track']);
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }
}