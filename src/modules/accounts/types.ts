export type { Account } from '../../shared/types/account.types';

export interface AccountFormData {
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  revenue: number;
  employees: number;
  status: string;
}
