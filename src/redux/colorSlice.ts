import { Color, EmptyColorState } from '@/pages/Color';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const colorSlice = createSlice({
  name: 'color',
  initialState: EmptyColorState,
  reducers: {
    editColor: (state, action: PayloadAction<Color | null>) => {
      state.currentColor = action.payload;
    },
    clearColor: (state) => {
      state.currentColor = null;
    },
    setSearchColor: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editColor, clearColor, setSearchColor } = colorSlice.actions;

export default colorSlice.reducer;
