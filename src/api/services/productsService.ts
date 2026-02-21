/**
 * productsService
 * ---------------
 * Backend contract:
 *   GET    /products?tenantId=xxx       → Product[]
 *   GET    /products/:id                → Product
 *   POST   /products                    → Product
 *   PUT    /products/:id                → Product
 *   DELETE /products/:id                → 204
 */

import { apiClient } from '../apiClient';
import { Product } from '../../shared/types';

export const productsService = {
  getAll: (tenantId: string) =>
    apiClient.get<Product[]>(`/products?tenantId=${tenantId}`),

  getById: (id: string) =>
    apiClient.get<Product>(`/products/${id}`),

  create: (payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Product>('/products', payload),

  update: (id: string, payload: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<void>(`/products/${id}`),
};
