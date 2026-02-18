import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import { ApiSale, ApiDetail, Sale, SaleList, Total, ApiClient } from "../models";
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

        // export interface ApiClient {
        //     _id: number;
        //     nombres:string;
        //     apellidos:string;
        //     telefono: string;
        //     email: string;
        //     estado: string;
        //     nit: string;
        // }

    

        const newCliente  = {
            idcliente: saleN.nit,
            direccion: saleN.direction
        };

        const newPago = {
            estado: "Pagado",
            idtipopago: 1
        }


        const sale: Omit<ApiSale, "_id" | "fecha" | "direccion" | "idcliente" | "Cliente" > = {
            cliente: newCliente,
            detalles: detalles,
            pago: newPago
        };

        const response: AxiosResponse<{message: string, nuevaOrden: ApiSale}> = await axios.post(url, sale);
        const {nuevaOrden} = response.data
        
        return [undefined, SaleAdapter(nuevaOrden), response]

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

