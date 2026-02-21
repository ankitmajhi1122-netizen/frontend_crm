import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Campaign } from '../../shared/types';

interface CampaignsState {
  items: Campaign[];
  searchQuery: string;
  page: number;
}

const initialState: CampaignsState = {
  items: [],
  searchQuery: '',
  page: 0,
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setCampaigns(state, action: PayloadAction<Campaign[]>) { state.items = action.payload; },
    addCampaign(state, action: PayloadAction<Campaign>) { state.items.push(action.payload); },
    updateCampaign(state, action: PayloadAction<Campaign>) {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteCampaign(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    setCampaignsSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setCampaignsPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetCampaignsFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setCampaigns, addCampaign, updateCampaign, deleteCampaign, setCampaignsSearch, setCampaignsPage, resetCampaignsFilters } = campaignsSlice.actions;
export default campaignsSlice.reducer;
