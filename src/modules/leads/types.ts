export type { Lead, LeadStatus, LeadSource } from '../../shared/types/lead.types';

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: import('../../shared/types/lead.types').LeadStatus;
  source: import('../../shared/types/lead.types').LeadSource;
  score: number;
}
