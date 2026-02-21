import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addAccount, updateAccount, deleteAccount, setAccountsSearch } from '../../../store/slices/accountsSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredAccounts } from '../selectors/accountsSelectors';
import { Account } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { accountsService } from '../../../api';

export function useAccounts() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectFilteredAccounts);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createAccount = useCallback(async (data: Omit<Account, 'id' | 'tenantId' | 'ownerId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await accountsService.create({ ...data, tenantId: tenant.id, ownerId: user.id, createdBy: user.id });
    dispatch(addAccount(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'accounts', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editAccount = useCallback(async (account: Account) => {
    if (!tenant || !user) return;
    const updated = await accountsService.update(account.id, account);
    dispatch(updateAccount({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'accounts', recordId: account.id }));
  }, [dispatch, tenant, user]);

  const removeAccount = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await accountsService.delete(id);
    dispatch(deleteAccount(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'accounts', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setAccountsSearch(q)), [dispatch]);

  return { accounts, createAccount, editAccount, removeAccount, search };
}
