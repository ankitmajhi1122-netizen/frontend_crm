export type { Deal, DealStage, DealStatus } from '../../shared/types/deal.types';

export interface DealFormData {
  title: string;
  contactId: string;
  accountId: string;
  stage: import('../../shared/types/deal.types').DealStage;
  value: number;
  margin: number;
  cost: number;
  revenue: number;
  probability: number;
  closeDate: string;
  status: import('../../shared/types/deal.types').DealStatus;
}
