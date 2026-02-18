import { Client } from '@/pages/Sale'; /// Mover a pages client
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


//Todo mover en un futuro

/// Slice 
interface ClientState {
    currentClient: Client | null;
    search: string;
    nit: string;
    fullName: string;
}
  
const EmptyClientState: ClientState = {
    currentClient: null,
    search: '',
    nit:'',
    fullName:'',
};

const clientSlice = createSlice({
  name: 'client',
  initialState: EmptyClientState,
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
    setNitClient: (state, action: PayloadAction<string>) => {
        state.nit = action.payload;
    },
    setFullNameClient: (state, action: PayloadAction<string>) => {
        state.fullName = action.payload;
    },
  },
});

export const { editClient, clearClient,setSearchClient,setNitClient,setFullNameClient } = clientSlice.actions;

export default clientSlice.reducer;

