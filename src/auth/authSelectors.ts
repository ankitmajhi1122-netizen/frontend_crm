import { RootState } from '../app/store';

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectCurrentUserId = (state: RootState) => state.auth.currentUser?.id ?? null;
export const selectCurrentUserRole = (state: RootState) => state.auth.currentUser?.role ?? null;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
