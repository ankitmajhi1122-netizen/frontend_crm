export type { Product } from '../../shared/types/product.types';

export interface ProductFormData {
  name: string;
  sku: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  status: string;
}
