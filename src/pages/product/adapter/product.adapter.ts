import { ApiCreateProduct, ApiProduct } from "../models/product.api.type";
import { Product } from "../models/product.domain.type";
import { ProductForm } from "../models/product.view.type";

export const mapApiToProduct = (p: ApiProduct): Product => ({
  productCode: p.codigoprod,
  name: p.nombre,
  description: p.descripcion,
  price: Number(p.precio),

  brand: {
    id: p.Marca._id,
    name: p.Marca.nombre,
  },

  presentation: {
    id: p.Presentacion._id,
    name: p.Presentacion.nombre,
  },

  category: {
    id: p.Categoria._id,
    name: p.Categoria.nombre,
  },

  unit: {
    id: p.Unidad._id,
    name: p.Unidad.nombre,
    abbreviation: p.Unidad.abreviatura,
  },

  idBrand: p.idmarca,
  idPresentation: p.idpresentacion,
  idCategory: p.idcategoria,
  idUnit: p.idunidad,

  imageUrl: p.imagen,
  image: p.imageUrl,
});

export function ProductListAdapter(apiProductList: ApiProduct[]): Product[] {
    return apiProductList.map(mapApiToProduct);
}

//No se agrega la imagen porque no es seguro si se manda en el payload por lo que es mejor agregarlo en la UI
export const mapProductToApi = (p: ProductForm): ApiCreateProduct => ({
  nombre: p.name,
  precio: p.price,
  idcategoria: p.idCategory,
  idmarca: p.idBrand,
  idpresentacion: p.idPresentation,
  idunidad: p.idUnit,
  descripcion: p.description,
});

