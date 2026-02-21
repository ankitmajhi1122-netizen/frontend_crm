import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole, UserStatus } from '../../shared/types';

export interface ManagedUser extends User {
  mustResetPassword: boolean;
  password?: string; // Optional temporary password for display
}

export type PasswordChangeResult = 'ok' | 'wrong_password' | 'user_not_found' | null;

interface UsersState {
  items: ManagedUser[];
  passwordChangeResult: PasswordChangeResult;
}

const initialState: UsersState = {
  items: [],
  passwordChangeResult: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.items = action.payload.map((u) => ({ ...u, mustResetPassword: false }));
    },

    addUser(state, action: PayloadAction<ManagedUser>) {
      state.items.push(action.payload);
    },

    updateUser(
      state,
      action: PayloadAction<{ id: string; name?: string; role?: UserRole; status?: UserStatus }>
    ) {
      const u = state.items.find((x) => x.id === action.payload.id);
      if (!u) return;
      if (action.payload.name !== undefined) u.name = action.payload.name;
      if (action.payload.role !== undefined) u.role = action.payload.role;
      if (action.payload.status !== undefined) u.status = action.payload.status;
      u.updatedAt = new Date().toISOString();
    },

    setUserStatus(state, action: PayloadAction<{ id: string; status: UserStatus }>) {
      const u = state.items.find((x) => x.id === action.payload.id);
      if (!u) return;
      u.status = action.payload.status;
      u.updatedAt = new Date().toISOString();
    },

    adminResetPassword(
      state,
      action: PayloadAction<{ id: string; newPassword: string }>
    ) {
      const u = state.items.find((x) => x.id === action.payload.id);
      if (!u) return;
      u.mustResetPassword = true;
      u.updatedAt = new Date().toISOString();
    },

    selfSetPassword(
      state,
      action: PayloadAction<{ id: string }>
    ) {
      const u = state.items.find((x) => x.id === action.payload.id);
      if (!u) return;
      u.mustResetPassword = false;
      u.updatedAt = new Date().toISOString();
    },

    clearPasswordChangeResult(state) {
      state.passwordChangeResult = null;
    },

    setPasswordChangeResult(state, action: PayloadAction<PasswordChangeResult>) {
      state.passwordChangeResult = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  setUserStatus,
  adminResetPassword,
  selfSetPassword,
  clearPasswordChangeResult,
  setPasswordChangeResult,
} = usersSlice.actions;

export default usersSlice.reducer;
