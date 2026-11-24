import { EmptyCajaState } from '@/pages/Caja';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const cajaSlice = createSlice({
  name: 'caja',
  initialState: EmptyCajaState,
  reducers: {
    setSearchCaja: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { setSearchCaja } = cajaSlice.actions;

export default cajaSlice.reducer;
