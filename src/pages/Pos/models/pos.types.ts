import { Detail, PrecioCliente, Product } from '@/pages/product/models/product.domain.type';

export interface PosCartItem {
  id: string;
  codProductPresentation: string | number;
  idvariante?: number | null;
  variantLabel?: string;
  productCode: number;
  name: string;
  imageUrl?: string;
  brandName?: string;
  categoryName?: string;
  presentationName?: string;
  price: number;
  amount: number;
  subtotal: number;
  stock?: number | null;
  precios?: PrecioCliente[];
  preciosVariante?: PrecioCliente[];
  basePrice?: number;
}

export type PosProduct = Product;

export interface PosSellable {
  key: string;
  product: PosProduct;
  presentation: Detail;
}
