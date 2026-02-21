import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../../shared/types';

interface AccountsState {
  items: Account[];
  searchQuery: string;
  page: number;
}

const initialState: AccountsState = {
  items: [],
  searchQuery: '',
  page: 0,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts(state, action: PayloadAction<Account[]>) { state.items = action.payload; },
    addAccount(state, action: PayloadAction<Account>) { state.items.push(action.payload); },
    updateAccount(state, action: PayloadAction<Account>) {
      const idx = state.items.findIndex((a) => a.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteAccount(state, action: PayloadAction<string>) {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },
    setAccountsSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setAccountsPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetAccountsFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setAccounts, addAccount, updateAccount, deleteAccount, setAccountsSearch, setAccountsPage, resetAccountsFilters } = accountsSlice.actions;
export default accountsSlice.reducer;
