import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import { ApiSale, ApiDetail, Sale, SaleList, Total } from "../models";
import { SaleAdapter, SaleListAdapter } from "../adapter";

export const fetchSaleList = async (url: string, page: number, search: string): Promise<[Error?, SaleList?, Total?]> => {
    const params: { page: number; search?: string } = { page };
    if (search !== "") params.search = search;

    const config: AxiosRequestConfig = {
        params
    };
    
    try {

        const response: AxiosResponse<{ ordenes: ApiSale[], total: number }> = await axios.get(url, config);


        if (response.statusText !== 'OK') return [new Error(`Error fetching sales: ${response.statusText}`)];

        const {ordenes, total} = response.data

        return [undefined, SaleListAdapter(ordenes), total];
    } catch (error) {
        if (error instanceof Error) return [error];
        return [new Error(`Error fetching sales:`)];
    }
};


export const fetchSale = async (url: string): Promise<[Error?, Sale?]> => {    
    try {
        const response: AxiosResponse<{ data: ApiSale }> = await axios.get(url);
        
        if (response.statusText !== 'OK') return [new Error(`Error fetching sales: ${response.statusText}`)];

        const {data} = response.data
        return [undefined, SaleAdapter(data)];

    } catch (error) {
        throw new Error(`Error fetching sales: ${error}`);
    }
};


// CREATE
export const fetchSaleCreate = async (url: string, saleN: Sale):  Promise<[Error?, Sale?, any?]> => {
    try {
        const detalles: ApiDetail[] = [];

        if (Array.isArray(saleN.detail) && saleN.detail.length > 0) {
            saleN.detail.forEach(d => {
                detalles.push({
                    cantidad: d.amount,
                    precio: d.cost,
                    codigoprod: d.codProduct,
                    idsucursal: d.idBranch
                });
            });
        }
        // } else if (buyN.detail) {
        //     // Si 'buyN.detail' es un único objeto, lo convierte en un array de un solo elemento
        //     detalles.push({
        //         cantidad: buyN.detail.amount,
        //         costo: buyN.detail.cost,
        //         codigoprod: buyN.detail.codProduct,
        //         idsucursal: buyN.detail.idBranch
        //     });
        // }

        const sale: Omit<ApiSale, "_id"> = {
            // fecha: buyN.date.toISOString(), // Convertir la fecha a formato ISO
            fecha: saleN.date,
            direccion: saleN.direction,
            detalles: detalles
        };

        const response: AxiosResponse<{message: string, orden: ApiSale}> = await axios.post(url, sale);
        const {orden} = response.data
        
        return [undefined, SaleAdapter(orden), response]

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Server responded with a status other than 2xx
            throw new Error(`Error creating sale: ${error.response.data}`);
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error creating sale: ${error}`);
        }
    }
};

