import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addDeal, updateDeal, deleteDeal, setDealsSearch } from '../../../store/slices/dealsSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredDeals } from '../selectors/dealsSelectors';
import { Deal } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { dealsService } from '../../../api';

export function useDeals() {
  const dispatch = useAppDispatch();
  const deals = useAppSelector(selectFilteredDeals);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createDeal = useCallback(async (data: Omit<Deal, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await dealsService.create({ ...data, tenantId: tenant.id, createdBy: user.id });
    dispatch(addDeal(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'deals', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editDeal = useCallback(async (deal: Deal) => {
    if (!tenant || !user) return;
    const updated = await dealsService.update(deal.id, deal);
    dispatch(updateDeal({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'deals', recordId: deal.id }));
  }, [dispatch, tenant, user]);

  const removeDeal = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await dealsService.delete(id);
    dispatch(deleteDeal(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'deals', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setDealsSearch(q)), [dispatch]);

  return { deals, createDeal, editDeal, removeDeal, search };
}
