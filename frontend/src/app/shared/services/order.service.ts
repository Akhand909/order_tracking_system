import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderStatusUpdate } from '../models/order.model';
import { TrackingResponse } from '../models/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Admin Methods
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/admin/orders/${id}`);
  }

  getOrderByTrackingId(trackingId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/admin/orders/tracking/${trackingId}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/admin/orders`, order);
  }

  updateOrderStatus(id: string, statusUpdate: OrderStatusUpdate): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/admin/orders/${id}/status`, statusUpdate);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/orders/${id}`);
  }

  // Customer Methods
  trackOrder(trackingId: string): Observable<TrackingResponse> {
    return this.http.get<TrackingResponse>(`${this.apiUrl}/customer/track/${trackingId}`);
  }

  // Utility Methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'PROCESSING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'DISPATCHED': return 'primary';
      case 'IN_TRANSIT': return 'info';
      case 'OUT_FOR_DELIVERY': return 'warning';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PROCESSING': 'Processing',
      'CONFIRMED': 'Confirmed',
      'DISPATCHED': 'Dispatched',
      'IN_TRANSIT': 'In Transit',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}