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

  //Detalle
  idPresentation: number;
  price?: number;
  barCode?: string;
  baseQuantity?: number;
  presentacions?: Detail[];
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


//Detail product 
export interface Detail {
  idPresentation: number;
  price: number;
  barCode: string;
  baseQuantity: number;
  name?: string;
  id?: string;
  idprodPresenta?: number;
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

  image?: File | null | string;

  presentacions: Detail[];
  //Detalle
  price: number;
  barCode: string;
  baseQuantity: number;
}


export type ProductList = Array<Product>