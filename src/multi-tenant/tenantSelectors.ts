import { RootState } from '../app/store';
import { MODULE_ROUTES } from '../app/router/routeConfig';

export const selectCurrentTenant = (state: RootState) => state.tenant.currentTenant;
export const selectCurrentSubscription = (state: RootState) => state.tenant.currentSubscription;
export const selectDarkMode = (state: RootState) => state.tenant.darkMode;
export const selectPrimaryColor = (state: RootState) => state.tenant.currentTenant?.primaryColor ?? '#2563EB';
export const selectTenantFeatures = (_state: RootState) => MODULE_ROUTES.map(r => r.module);
export const selectTenantPlan = (state: RootState) => state.tenant.currentTenant?.plan ?? 'enterprise'; // Force enterprise view
