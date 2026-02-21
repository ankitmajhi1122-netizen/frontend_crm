export type Plan = 'basic' | 'pro' | 'enterprise';
export type TenantStatus = 'active' | 'suspended' | 'cancelled';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: Plan;
  status: TenantStatus;
  logoUrl: string;
  primaryColor: string;
  darkMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  plan: Plan;
  status: string;
  maxUsers: number;
  expiryDate: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}
