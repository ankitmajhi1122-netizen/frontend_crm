export type DealStage = 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type DealStatus = 'active' | 'won' | 'lost';

export interface Deal {
  id: string;
  tenantId: string;
  title: string;
  contactId: string;
  accountId: string;
  stage: DealStage;
  value: number;
  margin: number;
  cost: number;
  revenue: number;
  probability: number;
  closeDate: string;
  status: DealStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
