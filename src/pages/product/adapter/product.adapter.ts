import { ApiProduct, Product } from "../models";

export const ProductAdapter = (product: ApiProduct): Product => {
    return{
        id: product._id,
        name: product.nombre,
        price: product.precio,
        brand: product.Marca ? {
            id: product.Marca._id,
            name: product.Marca.nombre
        }: { id: 0, name: "" },
        presentation: product.Presentacion ?{
            id: product.Presentacion._id,
            name: product.Presentacion.nombre
        }: { id: 0, name: "" },
        category: product.Categoria ? {
            id: product.Categoria._id,
            name: product.Categoria.nombre
        }: { id: 0, name: "" },
        idBrand: product.idmarca,
        idPresentation: product.idpresentacion,
        idCategory: product.idcategoria,
        description: product.descripcion,
        productCode: product.codigoprod,
    }
}

export function ProductListAdapter(apiProductList: ApiProduct[]): Product[] {
    return apiProductList.map(ProductAdapter);
}