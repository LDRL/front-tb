import { Talla, EmptyTallaState } from '@/pages/Talla';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const tallaSlice = createSlice({
  name: 'talla',
  initialState: EmptyTallaState,
  reducers: {
    editTalla: (state, action: PayloadAction<Talla | null>) => {
      state.currentTalla = action.payload;
    },
    clearTalla: (state) => {
      state.currentTalla = null;
    },
    setSearchTalla: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editTalla, clearTalla, setSearchTalla } = tallaSlice.actions;

export default tallaSlice.reducer;
