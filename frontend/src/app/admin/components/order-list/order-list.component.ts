import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  searchTerm = '';
  statusFilter = 'ALL';
  sortField = 'orderDate';
  sortDirection = 'desc';

  statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'DISPATCHED', label: 'Dispatched' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.trackingId.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        order.itemName.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'customerName':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default: // orderDate
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
      }

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredOrders = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.applyFilters();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'fas fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
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

  viewOrder(orderId: number): void {
    this.router.navigate(['/admin/update-status', orderId]);
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          alert('Failed to delete order. Please try again.');
        }
      });
    }
  }

  createNewOrder(): void {
    this.router.navigate(['/admin/create']);
  }

  exportOrders(): void {
    // Simple CSV export
    const headers = ['Tracking ID', 'Customer Name', 'Email', 'Item', 'Quantity', 'Total', 'Status', 'Order Date'];
    const csvData = this.filteredOrders.map(order => [
      order.trackingId,
      order.customerName,
      order.customerEmail,
      order.itemName,
      order.quantity,
      order.totalAmount,
      order.status,
      new Date(order.orderDate).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  getTotalRevenue(): number {
    return this.filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  }

  getDeliveredCount(): number {
    return this.filteredOrders.filter(o => o.status === 'DELIVERED').length;
  }

  getProcessingCount(): number {
    return this.filteredOrders.filter(o => o.status === 'PROCESSING').length;
  }
}