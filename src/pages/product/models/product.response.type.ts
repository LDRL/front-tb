import { ApiProduct } from "./product.api.type";

export interface ApiResponseProduct {
  message: string;
  data: ApiProduct;
  ok: boolean;
}

export interface ApiResponseProductList {
  message: string;
  data: ApiProduct[];
  ok: boolean;

  meta: {
    total: number;
    totalPage: number;
    currentPage: number;
    limit: number;
  };
}