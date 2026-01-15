import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  orderForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  generatedTrackingId = '';

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
      companyName: [''],
      companyAddress: [''],
      itemName: ['', [Validators.required]],
      itemDescription: [''],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      totalAmount: ['', [Validators.required, Validators.min(0.01)]],
      notes: ['']
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.markFormGroupTouched(this.orderForm);
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const orderData = this.orderForm.value;

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.generatedTrackingId = response.trackingId;
        this.successMessage = `Order created successfully! Tracking ID: ${response.trackingId}`;
        this.errorMessage = '';

        // Reset form but keep tracking ID visible
        setTimeout(() => {
          this.orderForm.reset({
            quantity: 1
          });
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create order. Please try again.';
        this.successMessage = '';
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Tracking ID copied to clipboard!');
    });
  }

  viewAllOrders(): void {
    this.router.navigate(['/admin/orders']);
  }

  createAnotherOrder(): void {
    this.generatedTrackingId = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.orderForm.reset({
      quantity: 1
    });
  }

  get customerNameControl() {
    return this.orderForm.get('customerName');
  }

  get customerEmailControl() {
    return this.orderForm.get('customerEmail');
  }

  get customerPhoneControl() {
    return this.orderForm.get('customerPhone');
  }

  get shippingAddressControl() {
    return this.orderForm.get('shippingAddress');
  }

  get itemNameControl() {
    return this.orderForm.get('itemName');
  }

  get quantityControl() {
    return this.orderForm.get('quantity');
  }

  get totalAmountControl() {
    return this.orderForm.get('totalAmount');
  }
}