import { Dayjs } from "dayjs";

export interface HeaderH {
  id: string;
  date: Dayjs;
  address: string;
  providerId: number;
  providerName: string;
  total:number;
  saldoPendiente?: number;
}

export interface HeaderDetail {
  id: string;
  amount: number | string;
  quantity?: number;
  cost: number;
  subtotal?: number;
  product: string;
  variant?: string;
}

export interface BuyPaymentView {
  id: number | string;
  amount: number;
  paymentTypeId: number;
  status: string;
  date?: string;
}

export interface HeaderBuy {
  header: HeaderH;
  details: HeaderDetail[];
  payments: BuyPaymentView[];
}