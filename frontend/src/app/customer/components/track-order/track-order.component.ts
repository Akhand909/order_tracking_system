import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { Subscription, interval, timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  trackForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  autoRefreshEnabled = false;
  autoRefreshSubscription: Subscription | null = null;
  trackingId: string = '';

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {
    this.trackForm = this.fb.group({
      trackingId: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {
    // Check for tracking ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const trackingIdFromUrl = urlParams.get('id');
    if (trackingIdFromUrl) {
      this.trackForm.patchValue({ trackingId: trackingIdFromUrl });
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.trackForm.invalid) {
      this.markFormGroupTouched(this.trackForm);
      return;
    }

    this.trackingId = this.trackForm.get('trackingId')?.value;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.trackOrder(this.trackingId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Order found! Redirecting to details...`;

        // Navigate to order details page after a short delay
        setTimeout(() => {
          this.router.navigate(['/customer/details', this.trackingId]);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.errorMessage = 'Order not found. Please check your tracking ID.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid tracking ID format.';
        } else {
          this.errorMessage = 'An error occurred while tracking your order. Please try again.';
        }
        this.stopAutoRefresh();
      }
    });
  }

  toggleAutoRefresh(): void {
    if (this.autoRefreshEnabled) {
      this.stopAutoRefresh();
    } else if (this.trackingId) {
      this.startAutoRefresh();
    }
  }

  startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.autoRefreshEnabled = true;

    // Refresh every 30 seconds
    this.autoRefreshSubscription = interval(30000)
      .pipe(
        switchMap(() => this.orderService.trackOrder(this.trackingId)),
        takeWhile(() => this.autoRefreshEnabled)
      )
      .subscribe({
        next: (response) => {
          console.log('Auto-refresh: Order status updated');
        },
        error: (error) => {
          console.error('Auto-refresh error:', error);
          this.stopAutoRefresh();
        }
      });
  }

  stopAutoRefresh(): void {
    this.autoRefreshEnabled = false;
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  get trackingIdControl() {
    return this.trackForm.get('trackingId');
  }
}