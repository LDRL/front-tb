import { ApiPresentation } from "@/pages/Presentation";

export interface ApiProduct {
    _id: number;
    codigoprod: number;
    nombre: string;
    precio: number;
    Marca: ApiMarca;
    Presentacion: ApiPresentation;
    Categoria: ApiCategoria;
    idmarca: number;
    idpresentacion: number;
    idcategoria: number;
    descripcion: string;
    // updatedAt: Date
    //Datos para guardar catalgos
}

export interface Product {
    id: number;
    productCode: number;
    name: string;
    price: number;
    brand: Marca;
    presentation: Presentacion;
    category: Categoria;
    idBrand: number;
    idPresentation: number;
    idCategory: number;
    description: string;

}

export interface ApiMarca {
    _id: number;
    nombre:string;
}

interface Marca {
    id:number;
    name: string;
}


export interface ApiMarca {
    _id: number;
    nombre:string;
}

interface Presentacion {
    id:number;
    name: string;
}

// export interface ApiPresentacion {
//     _id: number;
//     nombre:string;
// }

interface Categoria {
    id:number;
    name: string;
}

export interface ApiCategoria {
    _id: number;
    nombre:string;
}

export const ProductEmptyState: Product = {
    id: 0,
    name: '',
    price: 0,
    brand: {
        id:0,
        name:'',
    },
    presentation: {
        id:0,
        name:'',
    },
    category: {
        id:0,
        name:'',
    },
    idBrand: 0,
    idPresentation: 0,
    idCategory: 0,
    description: "",
    productCode: 0
}

export type ProductList = Array<Product>

export type ProductTotal = {
    total: number
};

export type Total = number;


export type Data = Array<Record<string, string>>

export type ApiResponse = {
    message: string,
    producto: ProductList,
    total: number
}

export type ApiResponseProduct = {
    message: string,
    data: Product,
}

