export type CampaignType = 'Email' | 'Social' | 'Event' | 'Referral' | 'Other';
export type CampaignStatus = 'draft' | 'active' | 'done' | 'paused';

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  leads: number;
  converted: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
