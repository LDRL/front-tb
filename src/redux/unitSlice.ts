import { Unit, EmptyUnitState } from '@/pages/Unit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const unitSlice = createSlice({
  name: 'unit',
  initialState: EmptyUnitState,
  reducers: {
    editUnit: (state, action: PayloadAction<Unit | null>) => {
      state.currentUnit = action.payload;
    },
    clearUnit: (state) => {
      state.currentUnit = null;
    },
    setSearchUnit: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editUnit, clearUnit, setSearchUnit } = unitSlice.actions;

export default unitSlice.reducer;