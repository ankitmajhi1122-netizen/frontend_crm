import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addQuote, updateQuote, deleteQuote, setQuotesSearch } from '../../../store/slices/quotesSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredQuotes } from '../selectors/quotesSelectors';
import { Quote } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { quotesService } from '../../../api';

export function useQuotes() {
  const dispatch = useAppDispatch();
  const quotes = useAppSelector(selectFilteredQuotes);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createQuote = useCallback(async (data: Omit<Quote, 'id' | 'tenantId' | 'items' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await quotesService.create({ ...data, tenantId: tenant.id, items: [], createdBy: user.id });
    dispatch(addQuote(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'quotes', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editQuote = useCallback(async (quote: Quote) => {
    if (!tenant || !user) return;
    const updated = await quotesService.update(quote.id, quote);
    dispatch(updateQuote({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'quotes', recordId: quote.id }));
  }, [dispatch, tenant, user]);

  const removeQuote = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await quotesService.delete(id);
    dispatch(deleteQuote(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'quotes', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setQuotesSearch(q)), [dispatch]);

  return { quotes, createQuote, editQuote, removeQuote, search };
}
