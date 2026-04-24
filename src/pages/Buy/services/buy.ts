import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import { ApiBuy, ApiDetail, CreateBuyPayload } from "../models/buy.api.type";
import { Buy, BuyList, Total } from "../models/buy.domain.type";
import { CreateBuyResponse } from "../models/buy.response.type";
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
export const fetchBuyCreate = async (url: string, payload: CreateBuyPayload ): Promise<[Error?, Buy?, any?]> => {
  try {
    const response = await axios.post(url, payload);
    const { data } = response.data;
    return [undefined, BuyAdapter(data), response];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return [error, undefined, undefined];
    }
    return [new Error("Error de red"), undefined, undefined];
  }
};