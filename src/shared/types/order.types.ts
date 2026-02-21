export type OrderStatus = 'pending' | 'in_progress' | 'done' | 'cancelled';

export interface Order {
  id: string;
  tenantId: string;
  number: string;
  contactId: string;
  client: string;
  items: number;
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
