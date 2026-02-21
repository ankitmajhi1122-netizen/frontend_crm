import React from 'react';
import { usePermission } from '../../shared/hooks/usePermission';

interface WithPermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const WithPermission: React.FC<WithPermissionProps> = ({ permission, children, fallback = null }) => {
  const allowed = usePermission(permission);
  return allowed ? <>{children}</> : <>{fallback}</>;
};

export default WithPermission;
