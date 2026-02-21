export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'SIGNUP'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'TENANT_SWITCH'
  | 'ROLE_CHANGE'
  | 'PLAN_ACCESS_ATTEMPT'
  | 'USER_CREATED'
  | 'USER_DEACTIVATED'
  | 'USER_REACTIVATED'
  | 'PASSWORD_RESET'
  | 'ADMIN_PASSWORD_RESET';

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: AuditAction;
  module: string;
  recordId?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}
