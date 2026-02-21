/**
 * plansService
 * ------------
 * Backend contract:
 *   GET    /plans                       → PlanConfig[]  (all available plans)
 *   GET    /plans/:plan                 → PlanConfig    (single plan details)
 */

import { apiClient } from '../apiClient';

export interface PlanConfig {
  plan: string;
  label: string;
  subtitle: string;
  maxUsers: number;
  monthlyPrice: number;
  features: string[];
  featureLabels: { label: string; included: boolean }[];
}

export const plansService = {
  getAll: (): Promise<PlanConfig[]> => {
    return apiClient.get<PlanConfig[]>('/plans');
  },

  getByKey: (plan: string): Promise<PlanConfig | undefined> => {
    return apiClient.get<PlanConfig>(`/plans/${plan}`);
  },
};
