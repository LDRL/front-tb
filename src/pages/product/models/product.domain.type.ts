export interface Product {
  productCode: number;
  name: string;
  description: string;
  price: number;

  brand: Brand;
  presentation: Presentation;
  category: Category;
  unit: Unit;

  idBrand: number;
  idPresentation: number;
  idCategory: number;

  idUnit: number;

  imageUrl: string;     // 👈 backend
  image?: File | null | string;
  
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

export type ProductList = Array<Product>