import { Client } from "@/pages/Client/models";

export interface Detail{
    amount: number,
    cost: number, 
    codProductPresentation: number, 
    name?: string,
    subtotal?: number,
    id?: string,
}

export interface TypeOfSale {
    name:string;
    id: number;
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
    isQuote: boolean;
    idTypePay: number;
    client: Client;
    details: Detail[];
    typeOfSale: TypeOfSale
    idTypeCli?: number;
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
    isQuote: boolean;
    idTypePay: number;

    // campos temporales del form (detalle)

    nit?:string;
    name:string;
    client: Client;

    amount?: number;
    cost?: number;
    codProduct?: number;

    idTypeCli?: number;
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