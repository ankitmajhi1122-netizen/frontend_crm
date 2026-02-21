import { Plan } from '../types';

export const PLAN_FEATURES: Record<Plan, string[]> = {
  basic: ['dashboard', 'leads', 'contacts', 'deals', 'settings'],
  pro: ['dashboard', 'leads', 'contacts', 'accounts', 'deals', 'activities', 'campaigns', 'products', 'quotes', 'reports', 'settings'],
  enterprise: ['dashboard', 'leads', 'contacts', 'accounts', 'deals', 'activities', 'campaigns', 'products', 'quotes', 'invoices', 'orders', 'forecasting', 'reports', 'settings'],
};

export const PLAN_USER_LIMITS: Record<Plan, number> = {
  basic: 5,
  pro: 20,
  enterprise: 9999,
};

export const PLAN_LABELS: Record<Plan, string> = {
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
};
