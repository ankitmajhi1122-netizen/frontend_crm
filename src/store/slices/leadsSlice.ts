import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lead } from '../../shared/types';

interface LeadsState {
  items: Lead[];
  searchQuery: string;
  page: number;
  rowsPerPage: number;
}

const initialState: LeadsState = {
  items: [],
  searchQuery: '',
  page: 0,
  rowsPerPage: 10,
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads(state, action: PayloadAction<Lead[]>) { state.items = action.payload; },
    addLead(state, action: PayloadAction<Lead>) { state.items.push(action.payload); },
    updateLead(state, action: PayloadAction<Lead>) {
      const idx = state.items.findIndex((l) => l.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteLead(state, action: PayloadAction<string>) {
      state.items = state.items.filter((l) => l.id !== action.payload);
    },
    setLeadsSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setLeadsPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetLeadsFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setLeads, addLead, updateLead, deleteLead, setLeadsSearch, setLeadsPage, resetLeadsFilters } = leadsSlice.actions;
export default leadsSlice.reducer;
