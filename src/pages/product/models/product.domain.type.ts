export interface Product {
  productCode: number;
  name: string;
  description: string;

  brand: Brand;
  category: Category;
  unit: Unit;
  idBrand: number;
  idCategory: number;
  idUnit: number;
  imageUrl: string;     // 👈 backend
  image?: File | null | string;

  hasExpiration: boolean;
  //Detalle
  idPresentation: number;
  price?: number;
  barCode?: string;
  baseQuantity?: number;
  presentacions?: Detail[];
  stockMinimum: number;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Presentation {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
  abbreviation: string;
}


// Precio por tipo de cliente
export interface PrecioCliente {
  idprecios?: number;
  idtipoCli: number;
  precio: number;
  tipoprecio: string;
}

//Detail product 
export interface Detail {
  idPresentation: number;
  price: number;
  barCode: string;
  baseQuantity: number;
  name?: string;
  id?: string;
  idprodPresenta?: number;
  precios?: PrecioCliente[];
}


export interface ProductForm {
  productCode: number;
  name: string;
  //price: number;

  idBrand: number;
  idPresentation: number;
  idCategory: number;

  idUnit: number;

  description: string;

  hasExpiration: boolean;

  image?: File | null | string;

  presentacions: Detail[];
  //Detalle
  price: number;
  barCode: string;
  baseQuantity: number;
  stockMinimum: number;
}


export type ProductList = Array<Product>