import { useAppSelector } from '../../app/store/hooks';
import { selectCurrentUser } from '../../auth/authSelectors';
import { ROLE_PERMISSIONS } from '../constants/roles';
import { FIELD_ACCESS_CONFIG } from '../constants/fieldAccess';

export function usePermission(permission: string): boolean {
  const user = useAppSelector(selectCurrentUser);
  if (!user) return false;
  const perms = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] ?? [];
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

export function useFieldAccess(module: string, field: string): boolean {
  const user = useAppSelector(selectCurrentUser);
  if (!user) return false;
  // ADMIN always has full access
  if (user.role === 'ADMIN') return true;
  const moduleConfig = FIELD_ACCESS_CONFIG[module];
  if (!moduleConfig) return true;
  const fieldConfig = moduleConfig[field];
  if (!fieldConfig) return true;
  return fieldConfig.includes(user.role);
}
