export type { Invoice, InvoiceStatus } from '../../shared/types/invoice.types';

export interface InvoiceFormData {
  number: string;
  contactId: string;
  client: string;
  amount: number;
  tax: number;
  total: number;
  dueDate: string;
  status: import('../../shared/types/invoice.types').InvoiceStatus;
  quoteId: string | null;
}
