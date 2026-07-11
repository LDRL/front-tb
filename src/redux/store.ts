// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';

import authSlice  from './authSlice';
import productSliceReducer from './productSlice';
import sidebarSlice  from './sidebar';
import categorySlice from './categorySlice';
import brandSlice from './brandSlice';
import presentationSlice from './presentationSlice';
import saleSlice from './saleSlice';
import clientSlice from './clientSlice';
import userSlice from './userSlice';
import supplierSlice from './supplierSlice';
import rolSlice from './rolSlice';
import buySlice from './buySlice';

import { CategoryState } from '@/pages/Category';
import { BrandState } from '@/pages/Brand';
import { PresentationState } from '@/pages/Presentation';
import { Client } from '@/pages/Client/models/client.domain.type';
import { SaleState } from '@/pages/Sale/models/sale.domain.type';
import { SupplierState } from '@/pages/Supplier/models/supplier.domain.type';
import { RoleState } from '@/pages/Rol/models/role.domain.type';
import { AuthState } from '@/modules/auth/models/login.domain.type';
import { ProductForm } from '@/pages/product/models/product.domain.type';
import { UserState } from '@/pages/User/models/user.domain.type';
import { BuyState } from '@/pages/Buy/models/buy.domain.type';


interface sidebarInfo {
  state: boolean;
  mobileOpen: boolean;
}

interface ProductState {
  open: boolean;
  currentProduct: ProductForm | null;
  search: string;
}

// Todo mover en un futruo
interface ClientState {
  currentClient: Client | null;
  search: string;
  searchNit: string;
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
  supplier: SupplierState
  rol: RoleState
  buy: BuyState
}

export const store = configureStore<AppStore>({
  reducer: {
    auth : authSlice,
    sidebar: sidebarSlice,
    category: categorySlice,
    brand: brandSlice,
    presentation: presentationSlice,
    product: productSliceReducer,
    sale: saleSlice,
    client: clientSlice,
    user: userSlice,
    supplier: supplierSlice,
    rol: rolSlice,
    buy: buySlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
