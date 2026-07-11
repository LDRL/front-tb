
import { Buy, EmptyBuyState } from '@/pages/Buy/models/buy.domain.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const buySlice = createSlice({
  name: 'buy',
  initialState: EmptyBuyState,
  reducers: {
    editBuy: (state, action: PayloadAction<Buy | null>) => {
      state.currentBuy = action.payload;
    },
    clearBuy: (state) => {
      state.currentBuy = null;
    },
    setSearchBuy: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    }
  },
});

export const { editBuy, clearBuy,setSearchBuy } = buySlice.actions;

export default buySlice.reducer;

