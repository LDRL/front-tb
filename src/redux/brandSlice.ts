import { Brand, EmptyBrandState } from '@/pages/Brand';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const brandSlice = createSlice({
  name: 'brand',
  initialState: EmptyBrandState,
  reducers: {
    editBrand: (state, action: PayloadAction<Brand | null>) => {
      state.currentBrand = action.payload;
    },
    clearBrand: (state) => {
      state.currentBrand = null;
    },
    setSearchBrand: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editBrand, clearBrand,setSearchBrand } = brandSlice.actions;

export default brandSlice.reducer;

