import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '../../shared/types';

interface ContactsState {
  items: Contact[];
  searchQuery: string;
  page: number;
}

const initialState: ContactsState = {
  items: [],
  searchQuery: '',
  page: 0,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts(state, action: PayloadAction<Contact[]>) { state.items = action.payload; },
    addContact(state, action: PayloadAction<Contact>) { state.items.push(action.payload); },
    updateContact(state, action: PayloadAction<Contact>) {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteContact(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    setContactsSearch(state, action: PayloadAction<string>) { state.searchQuery = action.payload; state.page = 0; },
    setContactsPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    resetContactsFilters(state) { state.searchQuery = ''; state.page = 0; },
  },
});

export const { setContacts, addContact, updateContact, deleteContact, setContactsSearch, setContactsPage, resetContactsFilters } = contactsSlice.actions;
export default contactsSlice.reducer;
