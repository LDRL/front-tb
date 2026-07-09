// redux/productSlice.ts
import { Product, ProductForm } from '@/pages/product/models/product.domain.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  open: boolean;
  currentProduct: ProductForm | null;
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
      if (action.payload) {
        state.currentProduct = {
          productCode: action.payload.productCode,
          name: action.payload.name,
          idBrand: action.payload.idBrand,
          idPresentation: action.payload.idPresentation,
          idCategory: action.payload.idCategory,
          idUnit: action.payload.idUnit,
          description: action.payload.description,
          image: action.payload.image,

          presentacions: action.payload.presentacions ?? [],

          price: action.payload.price ?? 0,
          barCode: action.payload.barCode ?? '',
          baseQuantity: action.payload.baseQuantity ?? 0,
        };
      } else {
        state.currentProduct = null;
      }
    },
    clearProduct: (state) => {
      state.currentProduct = null;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { openModal, clearProduct, setSearch } = productSlice.actions;

export default productSlice.reducer;

