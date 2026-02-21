import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../shared/types';

interface OrdersState {
  items: Order[];
  searchQuery: string;
  page: number;
}

const initialState: OrdersState = {
  items: [],
  searchQuery: '',
  page: 0,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) { state.items = action.payload; },
    addOrder(state, action: PayloadAction<Order>) { state.items.push(action.payload); },
    updateOrder(state, action: PayloadAction<Order>) {
      const idx = state.items.findIndex((o) => o.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteOrder(state, action: PayloadAction<string>) {
      state.items = state.items.filter((o) => o.id !== action.payload);
    },
    setOrdersSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setOrdersPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetOrdersFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setOrders, addOrder, updateOrder, deleteOrder, setOrdersSearch, setOrdersPage, resetOrdersFilters } = ordersSlice.actions;
export default ordersSlice.reducer;
