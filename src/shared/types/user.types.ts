export type UserRole = 'ADMIN' | 'MANAGER' | 'SALES';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}
