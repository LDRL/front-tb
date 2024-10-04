import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

import { ProductAdapter, ProductListAdapter } from "../adapter";
import { Product, ProductList, Total, ApiProduct } from "../models";

export const productUrl = 'http://localhost:8080/api/productos/';

export const fetchProductList = async (url: string, page: number, search: string): Promise<[Error?, ProductList?, Total?]> => {
    const params: { page: number; search?: string } = { page };
    if (search !== "") params.search = search;

    const config: AxiosRequestConfig = {
        params
    };
    
    try {
        // const response: AxiosResponse<ApiResponse> = await axios.get(url, config);
        const response: AxiosResponse<{ data: ApiProduct[], total: number }> = await axios.get(url, config);

        if (response.statusText !== 'OK') return [new Error(`Error fetching products: ${response.statusText}`)];

        // const json: ApiResponse = response.data;
        // const total: Total = json.total;
        const {data, total} = response.data

        return [undefined, ProductListAdapter(data), total];
    } catch (error) {
        if (error instanceof Error) return [error];
        return [new Error(`Error fetching products:`)];
    }
};


export const fetchProduct = async (url: string): Promise<[Error?, Product?]> => {    
    try {
        const response: AxiosResponse<{ data: ApiProduct }> = await axios.get(url);
        
        if (response.statusText !== 'OK') return [new Error(`Error fetching products: ${response.statusText}`)];

        // const responseData: Product[] = ProductAdapter(response.data);
        const {data} = response.data
        return [undefined, ProductAdapter(data)];

    } catch (error) {
        // Lanza una excepción para que la función que llama a fetchProduct pueda manejar el error
        throw new Error(`Error fetching products: ${error}`);
    }
};


// CREATE
export const fetchProductCreate = async (url: string, productoN: Product):  Promise<[Error?, Product?]> => {
    try {
        const product: Omit<ApiProduct, "_id" | "codigoprod"| "precio" | "Marca" | "Categoria" | "Presentacion" > ={
            nombre:productoN.name,
            idcategoria: productoN.idCategory,
            idmarca: productoN.idBrand,
            idpresentacion: productoN.idPresentation,
            descripcion: productoN.description
        }
        const response: AxiosResponse<{message: string, producto: ApiProduct}> = await axios.post(url, product);
        const {producto} = response.data
        
        return [undefined, ProductAdapter(producto)]

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Server responded with a status other than 2xx
            throw new Error(`Error creating product: ${error.response.data}`);
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error creating product: ${error}`);
        }
    }
};

////////UPDATE
export const fetchProductUpdate = async (url: string, productU: Product):  Promise<[Error?, Product?]> => {
    try {
        const product: Omit<ApiProduct, "_id" | "codigoprod"| "precio" | "Marca" | "Categoria" | "Presentacion" > ={
            nombre:productU.name,
            idcategoria: productU.idCategory,
            idmarca: productU.idBrand,
            idpresentacion: productU.idPresentation,
            descripcion: productU.description
        }

        const response: AxiosResponse<{message: string, data: ApiProduct}> = await axios.put(url+productU.productCode+"/", product);

        // const response: AxiosResponse<{message: string, data: ApiProduct}> = await axios.post(url, product);

        const {data} = response.data

        // return response.data.id;
        // const json:   ApiResponseProduct = response.data 
        // const total: Total = json.total

        return [undefined, ProductAdapter(data)]

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Server responded with a status other than 2xx
            throw new Error(`Error update product: ${error.response.data}`);
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error update product: ${error}`);
        }
    }
};