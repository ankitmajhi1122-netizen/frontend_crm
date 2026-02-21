export type { Campaign, CampaignType, CampaignStatus } from '../../shared/types/campaign.types';

export interface CampaignFormData {
  name: string;
  type: import('../../shared/types/campaign.types').CampaignType;
  status: import('../../shared/types/campaign.types').CampaignStatus;
  budget: number;
  startDate: string;
  endDate: string;
}
