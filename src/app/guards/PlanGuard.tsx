import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCurrentSubscription } from '../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../auth/authSelectors';
import { selectCurrentTenant } from '../../multi-tenant/tenantSelectors';
import { addAuditLog } from '../../store/slices/auditSlice';
import PlanUpgradeModal from '../../core/layout/PlanUpgradeModal';

interface PlanGuardProps {
  module: string;
  children: React.ReactNode;
}

const PlanGuard: React.FC<PlanGuardProps> = ({ module, children }) => {
  const dispatch = useAppDispatch();
  const subscription = useAppSelector(selectCurrentSubscription);
  const user = useAppSelector(selectCurrentUser);
  const tenant = useAppSelector(selectCurrentTenant);

  // const hasAccess = subscription?.features.includes(module) ?? false;
  const hasAccess = true; // Bypassing plan verification for now

  useEffect(() => {
    if (!hasAccess && user && tenant) {
      dispatch(addAuditLog({
        tenantId: tenant.id,
        userId: user.id,
        action: 'PLAN_ACCESS_ATTEMPT',
        module,
        meta: { plan: subscription?.plan, requiredModule: module },
      }));
    }
  }, [hasAccess, user, tenant, module, subscription?.plan, dispatch]);

  if (!hasAccess) return <PlanUpgradeModal module={module} />;
  return <>{children}</>;
};

export default PlanGuard;
