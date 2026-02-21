import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../shared/types';

interface ProductsState {
  items: Product[];
  searchQuery: string;
  page: number;
}

const initialState: ProductsState = {
  items: [],
  searchQuery: '',
  page: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) { state.items = action.payload; },
    addProduct(state, action: PayloadAction<Product>) { state.items.push(action.payload); },
    updateProduct(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setProductsSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setProductsPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetProductsFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct, setProductsSearch, setProductsPage, resetProductsFilters } = productsSlice.actions;
export default productsSlice.reducer;
