import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../shared/types';
import { AUTH_TOKEN_KEY } from '../api/config';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const loadPersistedAuth = (): Partial<AuthState> => {
  try {
    const raw = localStorage.getItem('crm_auth');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
};

const persisted = loadPersistedAuth();

const initialState: AuthState = {
  currentUser: persisted.currentUser ?? null,
  isAuthenticated: persisted.isAuthenticated ?? false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('crm_auth', JSON.stringify({
        currentUser: action.payload,
        isAuthenticated: true,
      }));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('crm_auth');
      localStorage.removeItem('crm_tenant');
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
