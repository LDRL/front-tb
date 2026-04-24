import { Dayjs } from "dayjs";

export interface HeaderH {
  id: string;
  date: Dayjs;
  address: string;
  providerId: number;
  providerName: string;
}

export interface HeaderDetail {
  id: string;
  amount: number;
  cost: number;
  product: string;
}

export interface HeaderBuy {
  header: HeaderH;
  details: HeaderDetail[];
}