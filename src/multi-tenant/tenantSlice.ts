import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tenant, Subscription, Plan } from '../shared/types';
import { saveToStorage, loadFromStorage } from '../shared/utils/storageUtils';
import { generateId } from '../shared/utils/idUtils';

/** Features granted per plan — used as a fallback if subscription not loaded */
const PLAN_FEATURES: Record<Plan, string[]> = {
  basic: ['dashboard', 'leads', 'contacts', 'deals', 'settings'],
  pro: ['dashboard', 'leads', 'contacts', 'accounts', 'deals', 'activities', 'campaigns', 'products', 'quotes', 'reports', 'settings'],
  enterprise: ['dashboard', 'leads', 'contacts', 'accounts', 'deals', 'activities', 'campaigns', 'products', 'quotes', 'invoices', 'orders', 'forecasting', 'reports', 'settings'],
};

const PLAN_MAX_USERS: Record<Plan, number> = {
  basic: 5,
  pro: 20,
  enterprise: 9999,
};

const DARK_MODE_KEY = 'crm_dark_mode';
const TENANT_STORAGE_KEY = 'crm_current_tenant';

interface TenantState {
  currentTenant: Tenant | null;
  currentSubscription: Subscription | null;
  darkMode: boolean;
}

const initialState: TenantState = {
  currentTenant: loadFromStorage<Tenant | null>(TENANT_STORAGE_KEY, null),
  currentSubscription: null,
  darkMode: false,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant(state, action: PayloadAction<Tenant>) {
      state.currentTenant = action.payload;
      saveToStorage(TENANT_STORAGE_KEY, action.payload);

      // Per-tenant dark mode persistence
      const savedDark = loadFromStorage<boolean>(`${DARK_MODE_KEY}_${action.payload.id}`, action.payload.darkMode);
      state.darkMode = savedDark;

      // If no subscription provided, synthesise one from the plan (fallback)
      if (!state.currentSubscription) {
        const plan = action.payload.plan;
        const now = new Date().toISOString();
        const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        state.currentSubscription = {
          id: generateId('sub'),
          tenantId: action.payload.id,
          plan,
          status: 'active',
          maxUsers: PLAN_MAX_USERS[plan],
          expiryDate: expiry,
          features: PLAN_FEATURES[plan],
          createdAt: now,
          updatedAt: now,
        };
      }

      saveToStorage(TENANT_STORAGE_KEY, action.payload);
    },
    setSubscription(state, action: PayloadAction<Subscription>) {
      state.currentSubscription = action.payload;
    },
    resetTenantFilters(_state) {
      // Marker action — rootReducer listens to this to reset all module filters
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      if (state.currentTenant) {
        state.currentTenant = { ...state.currentTenant, darkMode: state.darkMode };
        saveToStorage<boolean>(`${DARK_MODE_KEY}_${state.currentTenant.id}`, state.darkMode);
      }
    },
    loadTenantFromStorage(state) {
      const tenant = state.currentTenant;
      if (tenant) {
        const savedDark = loadFromStorage<boolean>(`${DARK_MODE_KEY}_${tenant.id}`, tenant.darkMode);
        state.darkMode = savedDark;
      }
    },
  },
});

export const { setTenant, setSubscription, toggleDarkMode, loadTenantFromStorage, resetTenantFilters } = tenantSlice.actions;
export default tenantSlice.reducer;
