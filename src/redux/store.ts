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
  product: ProductState
}

export const store = configureStore<AppStore>({
  reducer: {
    user : userSliceReducer,
    sidebar: sidebarSlice,
    category: categorySlice,
    brand: brandSlice,
    product: productSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
