import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes';
import ProtectedRoute from '../guards/ProtectedRoute';
import PlanGuard from '../guards/PlanGuard';
import RoleGuard from '../guards/RoleGuard';
import SkeletonPage from '../../core/layout/SkeletonPage';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../../auth/authSelectors';

const LoginPage           = lazy(() => import('../../auth/pages/LoginPage'));
const SignUpPage           = lazy(() => import('../../auth/pages/SignUpPage'));
const ForgotPasswordPage  = lazy(() => import('../../auth/pages/ForgotPasswordPage'));
const ResetPasswordPage   = lazy(() => import('../../auth/pages/ResetPasswordPage'));
const DashboardPage    = lazy(() => import('../../modules/dashboard/pages/DashboardPage'));
const LeadsPage        = lazy(() => import('../../modules/leads/pages/LeadsPage'));
const ContactsPage     = lazy(() => import('../../modules/contacts/pages/ContactsPage'));
const AccountsPage     = lazy(() => import('../../modules/accounts/pages/AccountsPage'));
const DealsPage        = lazy(() => import('../../modules/deals/pages/DealsPage'));
const ActivitiesPage   = lazy(() => import('../../modules/activities/pages/ActivitiesPage'));
const CampaignsPage    = lazy(() => import('../../modules/campaigns/pages/CampaignsPage'));
const ProductsPage     = lazy(() => import('../../modules/products/pages/ProductsPage'));
const QuotesPage       = lazy(() => import('../../modules/quotes/pages/QuotesPage'));
const InvoicesPage     = lazy(() => import('../../modules/invoices/pages/InvoicesPage'));
const OrdersPage       = lazy(() => import('../../modules/orders/pages/OrdersPage'));
const ForecastingPage  = lazy(() => import('../../modules/forecasting/pages/ForecastingPage'));
const ReportsPage      = lazy(() => import('../../modules/reports/pages/ReportsPage'));
const SettingsPage     = lazy(() => import('../../modules/settings/pages/SettingsPage'));
const PermissionDenied = lazy(() => import('../../core/error/PermissionDenied'));
const NotFound         = lazy(() => import('../../core/error/NotFound'));

/** Redirects already-authenticated users away from public auth pages */
const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : element;
};

const AppRouter: React.FC = () => (
  <Suspense fallback={<SkeletonPage />}>
    <Routes>
      {/* Public auth routes — redirect to dashboard if already logged in */}
      <Route path={ROUTES.LOGIN}           element={<PublicRoute element={<LoginPage />} />} />
      <Route path={ROUTES.SIGNUP}          element={<PublicRoute element={<SignUpPage />} />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<PublicRoute element={<ForgotPasswordPage />} />} />
      {/* Reset password — accessible while logged in (first-login flow) */}
      <Route path={ROUTES.RESET_PASSWORD}  element={<ResetPasswordPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD}   element={<PlanGuard module="dashboard"><DashboardPage /></PlanGuard>} />
        <Route path={ROUTES.LEADS}       element={<PlanGuard module="leads"><LeadsPage /></PlanGuard>} />
        <Route path={ROUTES.CONTACTS}    element={<PlanGuard module="contacts"><ContactsPage /></PlanGuard>} />
        <Route path={ROUTES.ACCOUNTS}    element={<PlanGuard module="accounts"><AccountsPage /></PlanGuard>} />
        <Route path={ROUTES.DEALS}       element={<PlanGuard module="deals"><DealsPage /></PlanGuard>} />
        <Route path={ROUTES.ACTIVITIES}  element={<PlanGuard module="activities"><ActivitiesPage /></PlanGuard>} />
        <Route path={ROUTES.CAMPAIGNS}   element={<PlanGuard module="campaigns"><RoleGuard roles={['ADMIN','MANAGER']}><CampaignsPage /></RoleGuard></PlanGuard>} />
        <Route path={ROUTES.PRODUCTS}    element={<PlanGuard module="products"><RoleGuard roles={['ADMIN','MANAGER']}><ProductsPage /></RoleGuard></PlanGuard>} />
        <Route path={ROUTES.QUOTES}      element={<PlanGuard module="quotes"><RoleGuard roles={['ADMIN','MANAGER']}><QuotesPage /></RoleGuard></PlanGuard>} />
        <Route path={ROUTES.INVOICES}    element={<PlanGuard module="invoices"><RoleGuard roles={['ADMIN','MANAGER']}><InvoicesPage /></RoleGuard></PlanGuard>} />
        <Route path={ROUTES.ORDERS}      element={<PlanGuard module="orders"><RoleGuard roles={['ADMIN','MANAGER']}><OrdersPage /></RoleGuard></PlanGuard>} />
        <Route path={ROUTES.FORECASTING} element={<PlanGuard module="forecasting"><RoleGuard roles={['ADMIN','MANAGER']}><ForecastingPage /></RoleGuard></PlanGuard>} />
        <Route path={ROUTES.REPORTS}     element={<PlanGuard module="reports"><RoleGuard roles={['ADMIN','MANAGER']}><ReportsPage /></RoleGuard></PlanGuard>} />
        <Route path={ROUTES.SETTINGS}    element={<PlanGuard module="settings"><RoleGuard roles={['ADMIN','MANAGER']}><SettingsPage /></RoleGuard></PlanGuard>} />
      </Route>

      <Route path={ROUTES.PERMISSION_DENIED} element={<PermissionDenied />} />
      <Route path={ROUTES.NOT_FOUND}         element={<NotFound />} />
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
