import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import { ApiBuy, ApiDetail, Buy, BuyList, Total } from "../models";
import { BuyAdapter, BuyListAdapter } from "../adapter";

export const fetchBuyList = async (url: string, page: number, search: string): Promise<[Error?, BuyList?, Total?]> => {
    const params: { page: number; search?: string } = { page };
    if (search !== "") params.search = search;

    const config: AxiosRequestConfig = {
        params
    };
    
    try {
        const response: AxiosResponse<{ compras: ApiBuy[], total: number }> = await axios.get(url, config);
        if (response.statusText !== 'OK') return [new Error(`Error fetching buys: ${response.statusText}`)];
        const {compras, total} = response.data

        return [undefined, BuyListAdapter(compras), total];
    } catch (error) {
        if (error instanceof Error) return [error];
        return [new Error(`Error fetching buys:`)];
    }
};


export const fetchBuy = async (url: string): Promise<[Error?, Buy?]> => {    
    try {
        const response: AxiosResponse<{ data: ApiBuy }> = await axios.get(url);
        
        if (response.statusText !== 'OK') return [new Error(`Error fetching buys: ${response.statusText}`)];

        const {data} = response.data
        return [undefined, BuyAdapter(data)];

    } catch (error) {
        throw new Error(`Error fetching buys: ${error}`);
    }
};


// CREATE
export const fetchBuyCreate = async (url: string, buyN: Buy):  Promise<[Error?, Buy?, any?]> => {
    try {
        const detalles: ApiDetail[] = [];

        if (Array.isArray(buyN.detail) && buyN.detail.length > 0) {
            buyN.detail.forEach(d => {
                detalles.push({
                    cantidad: d.amount,
                    costo: d.cost,
                    codigoprod: d.codProduct,
                    idsucursal: d.idBranch
                });
            });
        }
      

        const buy: Omit<ApiBuy, "_id" | "estado" | "Proveedor"> = {
            // fecha: buyN.date.toISOString(), // Convertir la fecha a formato ISO
            fecha: buyN.date,
            direccion: buyN.direction,
            idproveedor: buyN.idProvider,
            total: buyN.total,
            detalles: detalles
        };

        const response: AxiosResponse<{message: string, compra: ApiBuy}> = await axios.post(url, buy);
        const {compra} = response.data
        
        return [undefined, BuyAdapter(compra), response]

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Server responded with a status other than 2xx
            throw new Error(`Error creating buy: ${error.response.data}`);
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error creating buy: ${error}`);
        }
    }
};

