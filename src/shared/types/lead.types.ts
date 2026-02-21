export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'disqualified';
export type LeadSource = 'web' | 'referral' | 'email' | 'social' | 'other';

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  score: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
