export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  tenantId: string;
  number: string;
  contactId: string;
  client: string;
  amount: number;
  tax: number;
  total: number;
  dueDate: string;
  status: InvoiceStatus;
  quoteId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
