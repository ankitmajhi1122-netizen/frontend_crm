export type { Order, OrderStatus } from '../../shared/types/order.types';

export interface OrderFormData {
  number: string;
  contactId: string;
  client: string;
  items: number;
  subtotal: number;
  tax: number;
  total: number;
  status: import('../../shared/types/order.types').OrderStatus;
  orderDate: string;
  deliveryDate: string | null;
}
