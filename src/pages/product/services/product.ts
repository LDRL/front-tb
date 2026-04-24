import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

import { mapApiToProduct, ProductListAdapter } from "../adapter";
import { Product, ProductList } from "../models/product.domain.type";
import { Total } from "@/pages/Sale";
import { ApiProduct } from "../models/product.api.type";
import axiosClient from "@/utils/axiosClient";

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
        return [undefined, mapApiToProduct(data)];

    } catch (error) {
        // Lanza una excepción para que la función que llama a fetchProduct pueda manejar el error
        throw new Error(`Error fetching products: ${error}`);
    }
};


// CREATE

export const fetchProductCreate = async (url: string,  payload: FormData ): Promise<[Error?, any?, any?]> => {
  try {
    const response = await axiosClient.post(url, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { data } = response.data;
    return [undefined, data, response];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return [error, undefined, undefined];
    }
    return [new Error("Error de red"), undefined, undefined];
  }
};


////////UPDATE
export const fetchProductUpdate = async (url: string,  payload: FormData):  Promise<[Error?, any?, any?]> => {
    try {
        const response = await axiosClient.put(url, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

       const { data } = response.data;
        return [undefined, data, response];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
        return [error, undefined, undefined];
        }
        return [new Error("Error de red"), undefined, undefined];
    }
};