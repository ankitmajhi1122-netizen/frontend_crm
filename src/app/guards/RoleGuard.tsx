import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../../auth/authSelectors';
import { UserRole } from '../../shared/types';
import { ROUTES } from '../../shared/constants/routes';

interface RoleGuardProps {
  roles: UserRole[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children }) => {
  const user = useAppSelector(selectCurrentUser);
  if (!user || !roles.includes(user.role)) {
    return <Navigate to={ROUTES.PERMISSION_DENIED} replace />;
  }
  return <>{children}</>;
};

export default RoleGuard;
