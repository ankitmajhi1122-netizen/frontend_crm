import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addContact, updateContact, deleteContact, setContactsSearch } from '../../../store/slices/contactsSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredContacts } from '../selectors/contactsSelectors';
import { Contact } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { contactsService } from '../../../api';

export function useContacts() {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectFilteredContacts);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createContact = useCallback(async (data: Omit<Contact, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await contactsService.create({ ...data, tenantId: tenant.id, createdBy: user.id });
    dispatch(addContact(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'contacts', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editContact = useCallback(async (contact: Contact) => {
    if (!tenant || !user) return;
    const updated = await contactsService.update(contact.id, contact);
    dispatch(updateContact({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'contacts', recordId: contact.id }));
  }, [dispatch, tenant, user]);

  const removeContact = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await contactsService.delete(id);
    dispatch(deleteContact(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'contacts', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setContactsSearch(q)), [dispatch]);

  return { contacts, createContact, editContact, removeContact, search };
}
