// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { UserInfo } from '@/models';
import { Product } from '@/pages/product';
import userSliceReducer  from './user';
import productSliceReducer from './productSlice';
import sidebarSlice  from './sidebar';
import categorySlice from './categorySlice';
import { CategoryState } from '@/pages/Category';
import { BrandState } from '@/pages/Brand';
import brandSlice from './brandSlice';
import presentationSlice from './presentationSlice';
import { PresentationState } from '@/pages/Presentation';
import saleSlice from './saleSlice';
import { SaleState } from '@/pages/Sale';

interface sidebarInfo {
  state: boolean;
}

interface ProductState {
  open: boolean;
  currentProduct: Product | null;
  search: string;
}


export interface AppStore {
  sidebar: sidebarInfo
  user: UserInfo
  category: CategoryState
  brand: BrandState
  presentation: PresentationState
  product: ProductState
  sale: SaleState
}

export const store = configureStore<AppStore>({
  reducer: {
    user : userSliceReducer,
    sidebar: sidebarSlice,
    category: categorySlice,
    brand: brandSlice,
    presentation: presentationSlice,
    product: productSliceReducer,
    sale: saleSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
