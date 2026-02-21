export type { Contact } from '../../shared/types/contact.types';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  accountId: string;
  status: string;
}
