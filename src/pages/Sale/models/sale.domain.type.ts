import { Client } from "@/pages/Client/models";

export interface Detail{
    amount: number,
    cost: number, 
    codProductPresentation: number, 
    name?: string,
    subtotal?: number,
    id?: string,
}

export interface Sale {
    id?: number;
    name: string;
    date: string;
    address: string;
    idClient: number;
    
    idSucursal: number;
    idUser: string;
    total?: number;
    
    client: Client;
    details: Detail[];
}


export interface SaleForm {
    id?: number;
    date: string;
    address: string;
    idClient: number;
    idUser: string;
    idSucursal: number;
    details: Detail[];
    pay: PayForm;

    // campos temporales del form (detalle)

    nit?:string;
    name:string;
    client: Client;

    amount?: number;
    cost?: number;
    codProduct?: number;
}

export interface PayForm {
    idTypePay?: string;
    state: string;
}

// View buy show


export interface Pay {
    _id: number,
    amount: number,
    idOrden: number,
    idPaymentType: number,
    paymentDate: String,
}


////////
export type SaleList = Sale[];

export type Total = number;


/// Slice 
export interface SaleState {
    currentSale: Sale | null;
    search: string;
}

export const EmptySaleState: SaleState = {
    currentSale: null,
    search: ''
};