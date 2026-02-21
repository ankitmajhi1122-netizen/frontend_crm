import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addInvoice, updateInvoice, deleteInvoice, setInvoicesSearch } from '../../../store/slices/invoicesSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredInvoices } from '../selectors/invoicesSelectors';
import { Invoice } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { invoicesService } from '../../../api';

export function useInvoices() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectFilteredInvoices);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createInvoice = useCallback(async (data: Omit<Invoice, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await invoicesService.create({ ...data, tenantId: tenant.id, createdBy: user.id });
    dispatch(addInvoice(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'invoices', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editInvoice = useCallback(async (invoice: Invoice) => {
    if (!tenant || !user) return;
    const updated = await invoicesService.update(invoice.id, invoice);
    dispatch(updateInvoice({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'invoices', recordId: invoice.id }));
  }, [dispatch, tenant, user]);

  const removeInvoice = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await invoicesService.delete(id);
    dispatch(deleteInvoice(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'invoices', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setInvoicesSearch(q)), [dispatch]);

  return { invoices, createInvoice, editInvoice, removeInvoice, search };
}
