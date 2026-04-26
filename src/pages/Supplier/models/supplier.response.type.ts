import { ApiSupplier } from "./supplier.api.type";
import { Supplier } from "./supplier.domain.type";


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