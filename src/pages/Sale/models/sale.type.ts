export interface ApiSale {
    _id: number;
    // fecha: Date;
    fecha: string;
    direccion: string;
    // estado: boolean;
    detalles?: ApiDetail[]; 
    // updatedAt: Date
}


export interface ApiDetail {
    cantidad: number,
    precio: number,
    codigoprod: number,
    idsucursal?: number
    nombre?: string,
}

export interface Detail{
    amount: number,
    cost: number, 
    codProduct: number, 
    name?: string,
    subtotal?: number,
    id?: number,
    idBranch?: number,
}


export interface Sale {
    id?: number;
    // date: Date;
    date: string;
    direction: string;
    // state: boolean;
    detail?: Detail[];

    //
    amount?: number,
    cost?: number, 
    codProduct?: number, 
    name?: string,
    subtotal?: number,
}

export type SaleList = Array<Sale>

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