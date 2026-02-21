import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deal } from '../../shared/types';

interface DealsState {
  items: Deal[];
  searchQuery: string;
  page: number;
  rowsPerPage: number;
}

const initialState: DealsState = {
  items: [],
  searchQuery: '',
  page: 0,
  rowsPerPage: 10,
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setDeals(state, action: PayloadAction<Deal[]>) { state.items = action.payload; },
    addDeal(state, action: PayloadAction<Deal>) { state.items.push(action.payload); },
    updateDeal(state, action: PayloadAction<Deal>) {
      const idx = state.items.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteDeal(state, action: PayloadAction<string>) {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
    setDealsSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setDealsPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetDealsFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setDeals, addDeal, updateDeal, deleteDeal, setDealsSearch, setDealsPage, resetDealsFilters } = dealsSlice.actions;
export default dealsSlice.reducer;
