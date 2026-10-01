// redux/productSlice.ts
import { EmptyProductState, Product } from '@/pages/product';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
          hasExpiration: action.payload.hasExpiration ?? false,

          presentacions: action.payload.presentacions ?? [],

          price: action.payload.price ?? 0,
          barCode: action.payload.barCode ?? '',
          baseQuantity: action.payload.baseQuantity ?? 0,
          stockMinimum: action.payload.stockMinimum ?? 0
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

