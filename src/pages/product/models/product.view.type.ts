export interface ProductForm {
  productCode: number;
  name: string;
  price: number;

  idBrand: number;
  idPresentation: number;
  idCategory: number;

  idUnit: number;

  description: string;

  image?: File | null | string;
}

