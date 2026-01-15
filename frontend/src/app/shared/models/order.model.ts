export interface Order {
  id: number;
  trackingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  companyName?: string;
  companyAddress?: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  totalAmount: number;
  status: string;
  orderDate: string;
  dispatchedDate: string;
  inTransitDate: string;
  deliveredDate: string;
  notes: string;
}

export interface OrderStatusUpdate {
  status: string;
  notes?: string;
}