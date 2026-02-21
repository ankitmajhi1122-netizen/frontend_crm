import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectCurrentTenant } from '../../multi-tenant/tenantSelectors';
import { ROUTES } from '../../shared/constants/routes';

interface TenantGuardProps {
  children: React.ReactNode;
}

const TenantGuard: React.FC<TenantGuardProps> = ({ children }) => {
  const tenant = useAppSelector(selectCurrentTenant);
  if (!tenant) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
};

export default TenantGuard;
