import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addCampaign, updateCampaign, deleteCampaign, setCampaignsSearch } from '../../../store/slices/campaignsSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { selectFilteredCampaigns } from '../selectors/campaignsSelectors';
import { Campaign } from '../../../shared/types';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { campaignsService } from '../../../api';

export function useCampaigns() {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector(selectFilteredCampaigns);
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);

  const createCampaign = useCallback(async (data: Omit<Campaign, 'id' | 'tenantId' | 'leads' | 'converted' | 'spent' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    const created = await campaignsService.create({ ...data, tenantId: tenant.id, leads: 0, converted: 0, spent: 0, createdBy: user.id });
    dispatch(addCampaign(created));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'campaigns', recordId: created.id }));
  }, [dispatch, tenant, user]);

  const editCampaign = useCallback(async (campaign: Campaign) => {
    if (!tenant || !user) return;
    const updated = await campaignsService.update(campaign.id, campaign);
    dispatch(updateCampaign({ ...updated, updatedAt: new Date().toISOString() }));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'campaigns', recordId: campaign.id }));
  }, [dispatch, tenant, user]);

  const removeCampaign = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    await campaignsService.delete(id);
    dispatch(deleteCampaign(id));
    dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'campaigns', recordId: id }));
  }, [dispatch, tenant, user]);

  const search = useCallback((q: string) => dispatch(setCampaignsSearch(q)), [dispatch]);

  return { campaigns, createCampaign, editCampaign, removeCampaign, search };
}
