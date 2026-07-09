import { ApiSupplier } from "./supplier.api.type";


export interface ApiResponseSupplierList {
  message: string;
  data: ApiSupplier[];
  ok: boolean;

  meta: {
    total: number;
    totalPage: number;
    currentPage: number;
    limit: number;
  };
}