export interface ApiBuy {
    _id: number;
    fecha: Date;
    direccion: string;
    estado: boolean;
    idproveedor: number;
    Proveedor: ApiProvider;
    detalles?: ApiDetail[]; 
    // updatedAt: Date
}


interface Provider {
    id:number;
    name: string;
    direction: string;
    telphone: string;
    email: string;
    state: string;
}

export interface ApiDetail {
    cantidad: number,
    costo: number,
    codigoprod: number,
    idsucursal: number
}

export interface Detail{
    amount: number,
    cost: number, 
    codProduct: number, 
    idBranch: number,
}


export interface ApiProvider {
    _id: number;
    nombre:string;
    direccion: string;
    telefono: string;
    email: string;
    estado: string;
}


export interface Buy {
    id: number;
    date: Date;
    direction: string;
    state: boolean;
    idProvider: number;
    provider: Provider;
    detail?: Detail[];
}

export type BuyList = Array<Buy>

export type Total = number;