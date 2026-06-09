import { Client } from '@/pages/Client/models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClientState {
  currentClient: Client | null;
  search: string;
  searchNit: string;
}

const initialState: ClientState = {
  currentClient: null,
  search: '',
  searchNit: '',
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    editClient: (state, action: PayloadAction<Client | null>) => {
      state.currentClient = action.payload;
    },

    clearClient: (state) => {
      state.currentClient = null;
    },

    setSearchClient: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setSearchNit: (state, action: PayloadAction<string>) => {
      state.searchNit = action.payload;
    },
  },
});

export const {
  editClient,
  clearClient,
  setSearchClient,
  setSearchNit,
} = clientSlice.actions;

export default clientSlice.reducer;