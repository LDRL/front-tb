import { Product } from "@/pages/product/models/product.domain.type";
import { Dayjs } from "dayjs";

export interface HeaderS {
  id: number;
  name: string;
  date: Dayjs;
  address: string;
  total: number;  
  nit: string;
  pay:string;
}

export interface HeaderDetailSale {
    id: number;
    amount:number;
    cost: number;
    product: string;
}

interface Pay {
    _id: number,
    amount: number,
    idOrden: number,
    idPaymentType: number,
    paymentDate: Dayjs,
}

export interface HeaderSale {
    header: HeaderS;
    details: HeaderDetailSale[];
    pay: Pay;
}