import { Sale, EmptySaleState } from '@/pages/Sale';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const saleSlice = createSlice({
  name: 'sale',
  initialState: EmptySaleState,
  reducers: {
    editSale: (state, action: PayloadAction<Sale | null>) => {
      state.currentSale = action.payload;
    },
    clearSale: (state) => {
      state.currentSale = null;
    },
    setSearchSale: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editSale, clearSale,setSearchSale } = saleSlice.actions;

export default saleSlice.reducer;

