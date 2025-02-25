import { Dayjs } from "dayjs";

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

export interface ApiClient {
    _id: number;
    nombres:string;
    apellidos:string;
    telefono: string;
    email: string;
    estado: string;
}

interface Client {
    id:number;
    name: string;
    lastName: string;
    telphone: string;
    email: string;
    state: string;
    fullName?: string;
}

export interface ApiSale {
    _id: number;
    // fecha: Date;
    fecha: string;
    direccion: string;
    // estado: boolean;
    idcliente: number;
    Cliente: ApiClient;
    total?:number;
    detalles?: ApiDetail[]; 
    // updatedAt: Date
}

export interface Sale {
    id?: number;
    // date: Date;
    date: string;
    direction: string;
    idClient: number;
    client: Client;
    total?: number;
    
    // state: boolean;
    detail?: Detail[];

    //
    amount?: number,
    cost?: number, 
    codProduct?: number, 
    name?: string,
    subtotal?: number,
}


// View buy show
export interface ApiPay {
    idpagos: number,
    importe: number,
    idorden: number,
    idtipopago: number,
    fecha_pago: string,
}

export interface Pay {
    _id: number,
    amount: number,
    idOrden: number,
    idPaymentType: number,
    paymentDate: Dayjs,
}

interface ApiProduct {
    _id : number,
    codigoprod: number,
    nombre: string,
}

interface Product {
    _id: number;
    productCode: number,
    name: string;
}
export interface ApiHeaderDetailSale{
    _id: number,
    cantidad: number,
    precio: number,
    codigoprod:number,
    Producto: ApiProduct,
    
}

export interface HeaderDetailSale {
    _id: number;
    amount:number;
    cost: number;
    productCode: number,
    product: Product;
}

export interface ApiHeaderSale {
    _id: number,
    fecha: Dayjs,
    direccion: string,
    total:number,
    Cliente: ApiClient,
    Detalles: ApiHeaderDetailSale[]
    Pago: ApiPay,
}
export interface HeaderSale {
    _id: number;
    date: Dayjs;
    direction: string;
    total: number
    client:Client;
    details: HeaderDetailSale[]
    pay: Pay;
}

////////
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