import { Dayjs } from "dayjs";

export interface HeaderH {
  id: string;
  date: Dayjs;
  address: string;
  providerId: number;
  providerName: string;
  total:number;
}

export interface HeaderDetail {
  id: string;
  amount: number | string;
  cost: number;
  product: string;
  variant?: string;
}

export interface HeaderBuy {
  header: HeaderH;
  details: HeaderDetail[];
}