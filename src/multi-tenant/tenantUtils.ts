import { Tenant, Subscription } from '../shared/types';
import { PLAN_FEATURES } from '../shared/constants/plans';

export function getFeaturesByTenant(subscription: Subscription | null): string[] {
  if (!subscription) return [];
  return PLAN_FEATURES[subscription.plan] ?? [];
}

export function isTenantActive(tenant: Tenant): boolean {
  return tenant.status === 'active';
}

export function isFeatureEnabled(subscription: Subscription | null, feature: string): boolean {
  if (!subscription) return false;
  return subscription.features.includes(feature);
}
