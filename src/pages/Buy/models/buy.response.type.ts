import { ApiBuy } from "./buy.api.type";

export interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
}

export type CreateBuyResponse = ApiResponse<ApiBuy>;
export type ApiBuyResponse = ApiResponse<ApiBuy>;