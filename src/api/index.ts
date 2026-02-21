/**
 * API Layer — barrel export
 * -------------------------
 * Import from here in components and slices.
 * All calls go to the real backend.
 * Configure VITE_API_BASE_URL in .env.local to point to your backend.
 */

export { API_BASE_URL } from './config';
export { apiClient, ApiError } from './apiClient';

export { authService } from './services/authService';
export { usersService } from './services/usersService';
export { leadsService } from './services/leadsService';
export { contactsService } from './services/contactsService';
export { accountsService } from './services/accountsService';
export { dealsService } from './services/dealsService';
export { tasksService } from './services/tasksService';
export { campaignsService } from './services/campaignsService';
export { productsService } from './services/productsService';
export { quotesService } from './services/quotesService';
export { invoicesService } from './services/invoicesService';
export { ordersService } from './services/ordersService';
export { tenantsService } from './services/tenantsService';
export { plansService } from './services/plansService';
export type { PlanConfig } from './services/plansService';
