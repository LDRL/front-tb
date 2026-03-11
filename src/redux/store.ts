// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';

import authSliceReducer  from './user';
import productSliceReducer from './productSlice';
import sidebarSlice  from './sidebar';
import categorySlice from './categorySlice';
import brandSlice from './brandSlice';
import presentationSlice from './presentationSlice';
import saleSlice from './saleSlice';
import clientSlice from './clientSlice';
import userSlice from './userSlice';


import { Product } from '@/pages/product';
import { CategoryState } from '@/pages/Category';
import { BrandState } from '@/pages/Brand';
import { PresentationState } from '@/pages/Presentation';
import { Client, SaleState } from '@/pages/Sale';
import { UserState } from '@/pages/User';
import { AuthState } from '@/modules/auth/models/login.type';


interface sidebarInfo {
  state: boolean;
}

interface ProductState {
  open: boolean;
  currentProduct: Product | null;
  search: string;
}

// Todo mover en un futruo
interface ClientState {
    currentClient: Client | null;
    search: string;
    nit: string;
    fullName: string;
}


export interface AppStore {
  sidebar: sidebarInfo
  auth: AuthState
  category: CategoryState
  brand: BrandState
  presentation: PresentationState
  product: ProductState
  sale: SaleState
  client:ClientState
  user:UserState
}

export const store = configureStore<AppStore>({
  reducer: {
    auth : authSliceReducer,
    sidebar: sidebarSlice,
    category: categorySlice,
    brand: brandSlice,
    presentation: presentationSlice,
    product: productSliceReducer,
    sale: saleSlice,
    client: clientSlice,
    user: userSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
