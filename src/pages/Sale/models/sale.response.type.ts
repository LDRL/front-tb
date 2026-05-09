import { ApiSale } from "./sale.api.type";


export interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
}

export type CreateBuyResponse = ApiResponse<ApiSale>;
export type ApiBuyResponse = ApiResponse<ApiSale>;