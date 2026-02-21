import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { loadTenantFromStorage } from '../../multi-tenant/tenantSlice';

interface TenantProviderProps {
  children: React.ReactNode;
}

const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTenantFromStorage());
  }, [dispatch]);

  return <>{children}</>;
};

export default TenantProvider;
