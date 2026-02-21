export type QuoteStatus = 'draft' | 'sent' | 'active' | 'done' | 'expired';

export interface QuoteItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Quote {
  id: string;
  tenantId: string;
  number: string;
  contactId: string;
  contactName: string;
  dealId: string;
  amount: number;
  status: QuoteStatus;
  validUntil: string;
  items: QuoteItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
