export type { Quote, QuoteStatus, QuoteItem } from '../../shared/types/quote.types';

export interface QuoteFormData {
  number: string;
  contactId: string;
  contactName: string;
  dealId: string;
  amount: number;
  status: import('../../shared/types/quote.types').QuoteStatus;
  validUntil: string;
}
