import { UserRole } from '../types';

export function filterByTenant<T extends { tenantId: string }>(
  items: T[],
  tenantId: string
): T[] {
  return items.filter((item) => item.tenantId === tenantId);
}

export function filterByOwnership<T extends { createdBy: string }>(
  items: T[],
  userId: string,
  role: UserRole
): T[] {
  if (role === 'SALES') {
    return items.filter((item) => item.createdBy === userId);
  }
  return items;
}

export function filterByFeatureFlag(
  features: string[],
  requiredFeature: string
): boolean {
  return features.includes(requiredFeature);
}
