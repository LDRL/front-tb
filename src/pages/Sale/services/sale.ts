import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import { SaleAdapter, SaleListAdapter } from "../adapter";
import axiosClient, { getErrorMessage } from "@/utils/axiosClient";
import { ApiSale, CreateSalePayload } from "../models/sale.api.type";
import { Sale, SaleList, Total } from "../models/sale.domain.type";

export const fetchSaleList = async (url: string, page: number, search: string): Promise<[Error?, SaleList?, Total?]> => {
    const params: { page: number; search?: string } = { page };
    if (search !== "") params.search = search;

    const config: AxiosRequestConfig = {
        params
    };
    
    try {
        const response: AxiosResponse<{ ordenes: ApiSale[], total: number }> = await axiosClient.get(url, config);

        if (response.statusText !== 'OK') return [new Error(`Error fetching sales: ${response.statusText}`)];

        const {ordenes, total} = response.data

        return [undefined, SaleListAdapter(ordenes), total];
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};


export const fetchSale = async (url: string): Promise<[Error?, Sale?]> => {    
    try {
        const response: AxiosResponse<{ data: ApiSale }> = await axiosClient.get(url);
        
        if (response.statusText !== 'OK') return [new Error(`Error fetching sales: ${response.statusText}`)];

        const {data} = response.data
        return [undefined, SaleAdapter(data)];

    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};


// CREATE
/*
export const fetchSaleCreate = async (url: string, saleN: Sale):  Promise<[Error?, Sale?, any?]> => {
    try {
        const detalles: ApiDetail[] = [];

        if (Array.isArray(saleN.details) && saleN.details.length > 0) {
            saleN.details.forEach(d => {
                detalles.push({
                    cantidad: d.amount,
                    precio: d.cost,
                    codigoprod: d.codProduct
                });
            });
        }

        const newCliente  = {
            idcliente: saleN.nit,
            direccion: saleN.address
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
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};*/


export const fetchSaleCreate = async (url: string, payload: CreateSalePayload ): Promise<[Error?, Sale?, any?]> => {
  try {
    const response = await axiosClient.post(url, payload);
    const { data } = response.data;
    return [undefined, SaleAdapter(data), response];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return [error, undefined, undefined];
    }
    return [new Error("Error de red"), undefined, undefined];
  }
};