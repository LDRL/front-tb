export interface PosCartItem {
  id: string;
  codProductPresentation: string | number;
  productCode: number;
  name: string;
  imageUrl?: string;
  brandName?: string;
  categoryName?: string;
  presentationName?: string;
  price: number;
  amount: number;
  subtotal: number;
}

export interface PosProduct {
  productCode: number;
  name: string;
  imageUrl?: string;
  brand?: { id: number; name: string };
  category?: { id: number; name: string };
  presentacions?: Array<{
    id?: string | number;
    idprodPresenta?: number;
    idPresentation: number;
    name?: string;
    price?: number;
    barCode?: string;
    baseQuantity?: number;
    precios?: Array<{ idtipoCli: number; precio: number; tipoprecio?: string }>;
  }>;
  stockMinimum?: number;
}
