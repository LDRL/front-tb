import { Category, EmptyCategoryState } from '@/pages/Category';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: EmptyCategoryState,
  reducers: {
    editCategory: (state, action: PayloadAction<Category | null>) => {
      state.currentCategory = action.payload;
    },
    clearCategory: (state) => {
      state.currentCategory = null;
    },
    setSearchCategory: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { editCategory, clearCategory,setSearchCategory } = categorySlice.actions;

export default categorySlice.reducer;

