import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from '../../shared/types';

interface InvoicesState {
  items: Invoice[];
  searchQuery: string;
  page: number;
}

const initialState: InvoicesState = {
  items: [],
  searchQuery: '',
  page: 0,
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setInvoices(state, action: PayloadAction<Invoice[]>) { state.items = action.payload; },
    addInvoice(state, action: PayloadAction<Invoice>) { state.items.push(action.payload); },
    updateInvoice(state, action: PayloadAction<Invoice>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteInvoice(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    setInvoicesSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setInvoicesPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetInvoicesFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setInvoices, addInvoice, updateInvoice, deleteInvoice, setInvoicesSearch, setInvoicesPage, resetInvoicesFilters } = invoicesSlice.actions;
export default invoicesSlice.reducer;
