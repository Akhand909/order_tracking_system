export interface TrackingResponse {
  trackingId: string;
  customerName: string;
  itemName: string;
  status: string;
  statusDisplay: string;
  orderDate: string;
  lastUpdated: string;
  currentLocation: string;
  estimatedDelivery: string;
  notes: string;
  companyName?: string;
  companyAddress?: string;
}