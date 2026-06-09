import { lazy } from "react";
import { PrivateRoutes } from "@/models";
import { PERMISSIONS } from "@/modules/auth/helper/permissions";

export interface RouteConfig {
  path: string;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
  permission?: string;
}

const Dashboard = lazy(() => import("./Dashboard/Dashboard"))
const Home = lazy(() => import("./Home/Home"))
const Product = lazy(() => import("../product/Product"))
const ProductCreate = lazy(() => import("../product").then(m => ({ default: m.ProductCreate })))
const Category = lazy(() => import("../Category/Category"))
const CategoryCreate = lazy(() => import("../Category").then(m => ({ default: m.CategoryCreate })))
const Brand = lazy(() => import("../Brand/Brand"))
const BrandCreate = lazy(() => import("../Brand").then(m => ({ default: m.BrandCreate })))
const Presentation = lazy(() => import("../Presentation/Presentation"))
const PresentationCreate = lazy(() => import("../Presentation").then(m => ({ default: m.PresentationCreate })))
const Buy = lazy(() => import("../Buy/Buy"))
const BuyCreate = lazy(() => import("../Buy").then(m => ({ default: m.BuyCreate })))
const BuyShow = lazy(() => import("../Buy").then(m => ({ default: m.BuyShow })))
const Sale = lazy(() => import("../Sale/Sale"))
const SaleCreate = lazy(() => import("../Sale").then(m => ({ default: m.SaleCreate })))
const SaleShow = lazy(() => import("../Sale").then(m => ({ default: m.SaleShow })))
const User = lazy(() => import("../User/User"))
const UserCreate = lazy(() => import("../User").then(m => ({ default: m.UserCreate })))
const Supplier = lazy(() => import("../Supplier/Supplier"))
const SupplierCreate = lazy(() => import("../Supplier").then(m => ({ default: m.SupplierCreate })))
const Client = lazy(() => import("../Client/Client"))
const ClientCreate = lazy(() => import("../Client").then(m => ({ default: m.ClientCreate })))

export const publicRoutes: RouteConfig[] = [
  { path: PrivateRoutes.DASHBOARD, Component: Dashboard },
  { path: PrivateRoutes.HOME, Component: Home },
];

export const protectedRoutes: RouteConfig[] = [
  { path: PrivateRoutes.PRODUCT, Component: Product, permission: PERMISSIONS.PRODUCTS.READ },
  { path: PrivateRoutes.PRODUCT_CREATE, Component: ProductCreate, permission: PERMISSIONS.PRODUCTS.CREATE },
  { path: PrivateRoutes.PRODUCT_EDIT, Component: ProductCreate, permission: PERMISSIONS.PRODUCTS.UPDATE },

  { path: PrivateRoutes.CATEGORY, Component: Category, permission: PERMISSIONS.CATEGORIES.READ },
  { path: PrivateRoutes.CATEGORY_CREATE, Component: CategoryCreate, permission: PERMISSIONS.CATEGORIES.CREATE },
  { path: PrivateRoutes.CATEGORY_EDIT, Component: CategoryCreate, permission: PERMISSIONS.CATEGORIES.UPDATE },

  { path: PrivateRoutes.BRAND, Component: Brand, permission: PERMISSIONS.BRANDS.READ },
  { path: PrivateRoutes.BRAND_CREATE, Component: BrandCreate, permission: PERMISSIONS.BRANDS.CREATE },
  { path: PrivateRoutes.BRAND_EDIT, Component: BrandCreate, permission: PERMISSIONS.BRANDS.UPDATE },

  { path: PrivateRoutes.PRESENTATION, Component: Presentation, permission: PERMISSIONS.PRESENTATIONS.READ },
  { path: PrivateRoutes.PRESENTATION_CREATE, Component: PresentationCreate, permission: PERMISSIONS.PRESENTATIONS.CREATE },
  { path: PrivateRoutes.PRESENTATION_EDIT, Component: PresentationCreate, permission: PERMISSIONS.PRESENTATIONS.UPDATE },

  { path: PrivateRoutes.BUY, Component: Buy, permission: PERMISSIONS.PURCHASES.READ },
  { path: PrivateRoutes.BUY_CREATE, Component: BuyCreate, permission: PERMISSIONS.PURCHASES.CREATE },
  { path: PrivateRoutes.BUY_SHOW, Component: BuyShow, permission: PERMISSIONS.PURCHASES.READ },

  { path: PrivateRoutes.SALE, Component: Sale, permission: PERMISSIONS.SALES.READ },
  { path: PrivateRoutes.SALE_CREATE, Component: SaleCreate, permission: PERMISSIONS.SALES.CREATE },
  { path: PrivateRoutes.SALE_SHOW, Component: SaleShow, permission: PERMISSIONS.SALES.READ },

  { path: PrivateRoutes.USER, Component: User, permission: PERMISSIONS.USERS.READ },
  { path: PrivateRoutes.USER_CREATE, Component: UserCreate, permission: PERMISSIONS.USERS.CREATE },
  { path: PrivateRoutes.USER_EDIT, Component: UserCreate, permission: PERMISSIONS.USERS.UPDATE },

  { path: PrivateRoutes.SUPPLIER, Component: Supplier, permission: PERMISSIONS.PROVIDERS.READ },
  { path: PrivateRoutes.SUPPLIER_CREATE, Component: SupplierCreate, permission: PERMISSIONS.PROVIDERS.CREATE },
  { path: PrivateRoutes.SUPPLIER_EDIT, Component: SupplierCreate, permission: PERMISSIONS.PROVIDERS.UPDATE },

  { path: PrivateRoutes.CLIENT, Component: Client, permission: PERMISSIONS.CLIENTS.READ },
  { path: PrivateRoutes.CLIENT_CREATE, Component: ClientCreate, permission: PERMISSIONS.CLIENTS.CREATE },
  { path: PrivateRoutes.CLIENT_EDIT, Component: ClientCreate, permission: PERMISSIONS.CLIENTS.UPDATE },
];
