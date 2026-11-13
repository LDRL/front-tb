import { Dayjs } from "dayjs";

export interface HeaderS {
  id: number;
  name: string;
  date: Dayjs;
  address: string;
  total: number;  
  nit: string;
  pay:string;
  idState: number;
  paymentType: string;
}

export interface HeaderDetailSale {
    id: number;
    amount: number | string;
    quantity?: number;
    cost: number;
    subtotal?: number;
    product: string;
    variant?: string;
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