import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order.model';
import { Chart, registerables } from 'chart.js';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    orders: Order[] = [];
    isLoading = true;
    stats = {
        totalOrders: 0,
        processing: 0,
        dispatched: 0,
        inTransit: 0,
        delivered: 0,
        revenue: 0
    };

    recentOrders: Order[] = [];
    chart: any;

    constructor(
        private orderService: OrderService,
        private router: Router
    ) {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.isLoading = true;

        this.orderService.getAllOrders().subscribe({
            next: (orders) => {
                this.orders = orders;
                this.calculateStats();
                this.getRecentOrders();
                this.createChart();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading dashboard data:', error);
                this.isLoading = false;
            }
        });
    }

    calculateStats(): void {
        this.stats.totalOrders = this.orders.length;
        this.stats.processing = this.orders.filter(o => o.status === 'PROCESSING').length;
        this.stats.dispatched = this.orders.filter(o => o.status === 'DISPATCHED').length;
        this.stats.inTransit = this.orders.filter(o =>
            ['IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status)
        ).length;
        this.stats.delivered = this.orders.filter(o => o.status === 'DELIVERED').length;
        this.stats.revenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    }

    getRecentOrders(): void {
        this.recentOrders = [...this.orders]
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .slice(0, 5);
    }

    createChart(): void {
        const ctx = document.getElementById('statusChart') as HTMLCanvasElement;

        if (this.chart) {
            this.chart.destroy();
        }

        const statusCounts = {
            'PROCESSING': this.stats.processing,
            'CONFIRMED': this.orders.filter(o => o.status === 'CONFIRMED').length,
            'DISPATCHED': this.stats.dispatched,
            'IN_TRANSIT': this.orders.filter(o => o.status === 'IN_TRANSIT').length,
            'OUT_FOR_DELIVERY': this.orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
            'DELIVERED': this.stats.delivered
        };

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Processing', 'Confirmed', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'],
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#ffc107', // Processing - yellow
                        '#17a2b8', // Confirmed - cyan
                        '#007bff', // Dispatched - blue
                        '#6f42c1', // In Transit - purple
                        '#e83e8c', // Out for Delivery - pink
                        '#28a745'  // Delivered - green
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw as number;
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    getStatusColor(status: string): string {
        return this.orderService.getStatusColor(status);
    }

    getStatusText(status: string): string {
        return this.orderService.getStatusText(status);
    }

    formatCurrency(amount: number): string {
        return this.orderService.formatCurrency(amount);
    }

    formatDate(dateString: string): string {
        return this.orderService.formatDate(dateString);
    }

    viewOrderDetails(orderId: number): void {
        this.router.navigate(['/admin/update-status', orderId]);
    }

    refreshDashboard(): void {
        this.loadDashboardData();
    }
}