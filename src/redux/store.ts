// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { UserInfo } from '@/models';
import { Product } from '@/pages/product';
import userSliceReducer  from './user';
import productSliceReducer from './productSlice';
import sidebarSlice  from './sidebar';
import categorySlice from './categorySlice';
import { Category } from '@/pages/Category';


interface sidebarInfo {
  state: boolean;
}

interface ProductState {
  open: boolean;
  currentProduct: Product | null;
  search: string;
}

interface CategoryState {
  open: boolean;
  currentCategory: Category | null;
  search: string;
}

export interface AppStore {
  sidebar: sidebarInfo
  user: UserInfo
  category: CategoryState
  product: ProductState
}

export const store = configureStore<AppStore>({
  reducer: {
    user : userSliceReducer,
    sidebar: sidebarSlice,
    category: categorySlice,
    product: productSliceReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
