import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addLead, updateLead, deleteLead, setLeadsSearch } from '../../../store/slices/leadsSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredLeads } from '../selectors/leadsSelectors';
import { Lead } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { leadsService } from '../../../api';

export function useLeads() {
  const dispatch = useAppDispatch();
  const leads = useAppSelector(selectFilteredLeads);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createLead = useCallback(async (data: Omit<Lead, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await leadsService.create({ ...data, tenantId: tenant.id, createdBy: user.id });
    dispatch(addLead(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'leads', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editLead = useCallback(async (lead: Lead) => {
    if (!tenant || !user) return;
    const updated = await leadsService.update(lead.id, lead);
    dispatch(updateLead({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'leads', recordId: lead.id }));
  }, [dispatch, tenant, user]);

  const removeLead = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await leadsService.delete(id);
    dispatch(deleteLead(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'leads', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setLeadsSearch(q)), [dispatch]);

  return { leads, createLead, editLead, removeLead, search };
}
