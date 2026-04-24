export interface Detail {
  amount: number;
  cost: number;
  codProduct: number;
  name?: string;
  subtotal?: number;
  id?: number;
}

export interface Provider {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  state: string;
}

export interface Buy {
  id: number;
  name: string;
  date: string;
  address: string;
  state: boolean;
  idProvider: number;
  idSucursal: number;
  idUser: string;
  total?: number;

  provider: Provider;
  details: Detail[];
}

export interface BuyForm {
  id: number;
  name: string;
  date: string;
  address: string;
  state: boolean;
  idProvider: number;
  idSucursal: number;
  idUser: string;
  total?: number;

  provider: Provider;
  details: Detail[];

  // campos temporales del form (detalle)
  amount?: number;
  cost?: number;
  codProduct?: number;
}

export type BuyList = Buy[];
export type Total = number;