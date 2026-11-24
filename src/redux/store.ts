// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';

import authSlice  from './authSlice';
import productSliceReducer from './productSlice';
import sidebarSlice  from './sidebar';
import categorySlice from './categorySlice';
import brandSlice from './brandSlice';
import presentationSlice from './presentationSlice';
import unitSlice from './unitSlice';
import tallaSlice from './tallaSlice';
import colorSlice from './colorSlice';
import publicoSlice from './publicoSlice';
import saleSlice from './saleSlice';
import clientSlice from './clientSlice';
import userSlice from './userSlice';
import supplierSlice from './supplierSlice';
import rolSlice from './rolSlice';
import buySlice from './buySlice';
import cajaSlice from './cajaSlice';

import { CategoryState } from '@/pages/Category';
import { BrandState } from '@/pages/Brand';
import { PresentationState } from '@/pages/Presentation';
import { UnitState } from '@/pages/Unit';
import { TallaState } from '@/pages/Talla';
import { ColorState } from '@/pages/Color';
import { PublicoState } from '@/pages/Publico';
import { Client } from '@/pages/Client/models/client.domain.type';
import { SaleState } from '@/pages/Sale/models/sale.domain.type';
import { SupplierState } from '@/pages/Supplier/models/supplier.domain.type';
import { RoleState } from '@/pages/Rol/models/role.domain.type';
import { AuthState } from '@/modules/auth/models/login.domain.type';
import { ProductState } from '@/pages/product';
import { UserState } from '@/pages/User/models/user.domain.type';
import { BuyState } from '@/pages/Buy/models/buy.domain.type';
import { CajaState } from '@/pages/Caja';


interface sidebarInfo {
  state: boolean;
  mobileOpen: boolean;
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
  unit: UnitState
  talla: TallaState
  color: ColorState
  publico: PublicoState
  product: ProductState
  sale: SaleState
  client:ClientState
  user:UserState
  supplier: SupplierState
  rol: RoleState
  buy: BuyState
  caja: CajaState
}

export const store = configureStore<AppStore>({
  reducer: {
    auth : authSlice,
    sidebar: sidebarSlice,
    category: categorySlice,
    brand: brandSlice,
    presentation: presentationSlice,
    unit: unitSlice,
    talla: tallaSlice,
    color: colorSlice,
    publico: publicoSlice,
    product: productSliceReducer,
    sale: saleSlice,
    client: clientSlice,
    user: userSlice,
    supplier: supplierSlice,
    rol: rolSlice,
    buy: buySlice,
    caja: cajaSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
