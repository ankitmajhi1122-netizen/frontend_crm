import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addProduct, updateProduct, deleteProduct, setProductsSearch } from '../../../store/slices/productsSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredProducts } from '../selectors/productsSelectors';
import { Product } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { productsService } from '../../../api';

export function useProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredProducts);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createProduct = useCallback(async (data: Omit<Product, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await productsService.create({ ...data, tenantId: tenant.id, createdBy: user.id });
    dispatch(addProduct(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'products', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editProduct = useCallback(async (product: Product) => {
    if (!tenant || !user) return;
    const updated = await productsService.update(product.id, product);
    dispatch(updateProduct({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'products', recordId: product.id }));
  }, [dispatch, tenant, user]);

  const removeProduct = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await productsService.delete(id);
    dispatch(deleteProduct(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'products', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setProductsSearch(q)), [dispatch]);

  return { products, createProduct, editProduct, removeProduct, search };
}
