// redux/productSlice.ts
import { Product } from '@/pages/product';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Product } from '../models';


interface ProductState {
  open: boolean;
  currentProduct: Product | null;
  search: string;
}

const EmptyProductState: ProductState = {
  open: false,
  currentProduct: null,
  search: ''
};

const productSlice = createSlice({
  name: 'product',
  initialState: EmptyProductState,
  reducers: {
    openModal: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    closeModal: (state) => {
      state.currentProduct = null;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { openModal, closeModal,setSearch } = productSlice.actions;

export default productSlice.reducer;

