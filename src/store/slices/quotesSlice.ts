import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quote } from '../../shared/types';

interface QuotesState {
  items: Quote[];
  searchQuery: string;
  page: number;
}

const initialState: QuotesState = {
  items: [],
  searchQuery: '',
  page: 0,
};

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    setQuotes(state, action: PayloadAction<Quote[]>) { state.items = action.payload; },
    addQuote(state, action: PayloadAction<Quote>) { state.items.push(action.payload); },
    updateQuote(state, action: PayloadAction<Quote>) {
      const idx = state.items.findIndex((q) => q.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteQuote(state, action: PayloadAction<string>) {
      state.items = state.items.filter((q) => q.id !== action.payload);
    },
    setQuotesSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setQuotesPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetQuotesFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setQuotes, addQuote, updateQuote, deleteQuote, setQuotesSearch, setQuotesPage, resetQuotesFilters } = quotesSlice.actions;
export default quotesSlice.reducer;
