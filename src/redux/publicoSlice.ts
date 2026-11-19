import { Publico, EmptyPublicoState } from '@/pages/Publico';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const publicoSlice = createSlice({
  name: 'publico',
  initialState: EmptyPublicoState,
  reducers: {
    editPublico: (state, action: PayloadAction<Publico | null>) => {
      state.currentPublico = action.payload;
    },
    clearPublico: (state) => {
      state.currentPublico = null;
    },
    setSearchPublico: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editPublico, clearPublico, setSearchPublico } = publicoSlice.actions;

export default publicoSlice.reducer;
