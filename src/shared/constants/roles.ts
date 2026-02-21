import { UserRole } from '../types';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ['*'],
  MANAGER: [
    'dashboard:read',
    'leads:read', 'leads:write',
    'contacts:read', 'contacts:write',
    'accounts:read', 'accounts:write',
    'deals:read', 'deals:write',
    'activities:read', 'activities:write',
    'campaigns:read',
    'reports:read',
    'settings:read',
  ],
  SALES: [
    'dashboard:read',
    'leads:read', 'leads:write:own',
    'contacts:read', 'contacts:write:own',
    'deals:read', 'deals:write:own',
    'activities:read', 'activities:write:own',
  ],
};
// Field-level access config is defined in fieldAccess.ts — do not duplicate here.
