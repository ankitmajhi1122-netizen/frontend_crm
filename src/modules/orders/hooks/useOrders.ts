import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addOrder, updateOrder, deleteOrder, setOrdersSearch } from '../../../store/slices/ordersSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredOrders } from '../selectors/ordersSelectors';
import { Order } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { ordersService } from '../../../api';

export function useOrders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFilteredOrders);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createOrder = useCallback(async (data: Omit<Order, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await ordersService.create({ ...data, tenantId: tenant.id, createdBy: user.id });
    dispatch(addOrder(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'orders', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editOrder = useCallback(async (order: Order) => {
    if (!tenant || !user) return;
    const updated = await ordersService.update(order.id, order);
    dispatch(updateOrder({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'orders', recordId: order.id }));
  }, [dispatch, tenant, user]);

  const removeOrder = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await ordersService.delete(id);
    dispatch(deleteOrder(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'orders', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setOrdersSearch(q)), [dispatch]);

  return { orders, createOrder, editOrder, removeOrder, search };
}
