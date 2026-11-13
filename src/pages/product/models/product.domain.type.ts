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
  idPublico?: number | null;
  imageUrl: string;     // 👈 backend
  image?: File | null | string;

  hasExpiration: boolean;
  hasVariants: boolean;
  //Detalle
  idPresentation: number;
  price?: number;
  barCode?: string;
  baseQuantity?: number;
  presentacions?: Detail[];
  variantes?: VariantDetail[];
  stockMinimum: number;
  stock?: number | null;
  stockTexto?: string | null;
  stockDetalle?: string | null;
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
  idvariante?: number | null;
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
  preciosVariante?: PrecioCliente[];
}

export interface RowErrors {
  idPresentation?: boolean;
  price?: boolean;
  baseQuantity?: boolean;
}

// Variantes (talla/color/sku) - flat (API/persistencia)
export interface VariantDetail {
  id?: string; // UI row key
  idvariante?: number;
  idtalla?: number | null;
  idcolor?: number | null;
  sku?: string | null;
  estado?: number; // 1 activo, 0 inactivo
  tallaNombre?: string | null;
  colorNombre?: string | null;
  colorHex?: string | null;
  stock?: number | null;
  stockTexto?: string | null;
  varianteTexto?: string | null;
}

// Variante agrupada por color (UI): un color padre con varias tallas hijas
export interface VariantGroupTalla {
  idtalla: number;
  tallaNombre?: string;
  tallaTipo?: string;
  sku?: string | null;
  idvariante?: number;
  estado?: number;
}

export interface VariantGroupDetail {
  id?: string; // UI group key
  idcolor: number | null;
  colorNombre?: string | null;
  colorHex?: string | null;
  tallas: VariantGroupTalla[];
  // variante base sin talla (color solo), para preservar datos existentes
  baseIdvariante?: number;
  baseSku?: string | null;
  baseEstado?: number;
  hasBase?: boolean;
}

export interface VariantRowErrors {
  combination?: boolean;
  sku?: boolean;
}

export interface VariantGroupErrors {
  color?: boolean;
  tallas?: boolean;
}


export interface ProductForm {
  productCode: number;
  name: string;
  //price: number;

  idBrand: number;
  idPresentation: number;
  idCategory: number;

  idUnit: number;
  idPublico?: number | null;

  description: string;

  hasExpiration: boolean;
  hasVariants: boolean;

  image?: File | null | string;

  presentacions: Detail[];
  variantes: VariantDetail[];
  //Detalle
  price: number;
  barCode: string;
  baseQuantity: number;
  stockMinimum: number;
}


export type ProductList = Array<Product>


/// Slice
export interface ProductState {
  open: boolean;
  currentProduct: ProductForm | null;
  search: string;
}

export const EmptyProductState: ProductState = {
  open: false,
  currentProduct: null,
  search: ''
}
