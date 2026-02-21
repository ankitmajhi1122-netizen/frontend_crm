import { UserRole } from '../types';

/**
 * Centralized field-level access configuration.
 * Format: { module: { field: allowedRoles[] } }
 * If a module/field is not listed, all roles have access.
 */
export const FIELD_ACCESS_CONFIG: Record<string, Record<string, UserRole[]>> = {
  deals: {
    margin:   ['ADMIN', 'MANAGER'],
    revenue:  ['ADMIN', 'MANAGER'],
    cost:     ['ADMIN'],
    value:    ['ADMIN', 'MANAGER', 'SALES'],
    title:    ['ADMIN', 'MANAGER', 'SALES'],
    stage:    ['ADMIN', 'MANAGER', 'SALES'],
    probability: ['ADMIN', 'MANAGER'],
    closeDate:   ['ADMIN', 'MANAGER', 'SALES'],
  },
  contacts: {
    phone:  ['ADMIN', 'MANAGER', 'SALES'],
    email:  ['ADMIN', 'MANAGER', 'SALES'],
    company:['ADMIN', 'MANAGER', 'SALES'],
  },
  leads: {
    score:  ['ADMIN', 'MANAGER'],
    source: ['ADMIN', 'MANAGER', 'SALES'],
    status: ['ADMIN', 'MANAGER', 'SALES'],
  },
  settings: {
    billing: ['ADMIN'],
    users:   ['ADMIN'],
    general: ['ADMIN', 'MANAGER'],
  },
  reports: {
    revenue: ['ADMIN', 'MANAGER'],
    margin:  ['ADMIN'],
    forecast:['ADMIN', 'MANAGER'],
  },
  forecasting: {
    pipeline:  ['ADMIN', 'MANAGER'],
    weighted:  ['ADMIN', 'MANAGER'],
    wonRevenue:['ADMIN', 'MANAGER'],
  },
  accounts: {
    revenue:   ['ADMIN', 'MANAGER'],
    employees: ['ADMIN', 'MANAGER', 'SALES'],
  },
  campaigns: {
    budget: ['ADMIN', 'MANAGER'],
    spent:  ['ADMIN', 'MANAGER'],
  },
  invoices: {
    amount: ['ADMIN', 'MANAGER'],
    status: ['ADMIN', 'MANAGER'],
  },
  orders: {
    total:  ['ADMIN', 'MANAGER'],
    status: ['ADMIN', 'MANAGER'],
  },
  products: {
    price:    ['ADMIN', 'MANAGER'],
    category: ['ADMIN', 'MANAGER'],
  },
  quotes: {
    amount:    ['ADMIN', 'MANAGER'],
    validUntil:['ADMIN', 'MANAGER'],
  },
};
