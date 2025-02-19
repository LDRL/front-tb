import { Dayjs } from "dayjs";

export interface ApiDetail {
    cantidad: number,
    costo: number,
    codigoprod: number,
    idsucursal: number
    nombre?: string,
}

export interface Detail{
    amount: number,
    cost: number, 
    codProduct: number, 
    idBranch: number,
    name?: string,
    subtotal?: number,
    id?: number,
}


export interface ApiProvider {
    _id: number;
    nombre:string;
    direccion: string;
    telefono: string;
    email: string;
    estado: string;
}

interface Provider {
    id:number;
    name: string;
    direction: string;
    telphone: string;
    email: string;
    state: string;
}

export interface ApiBuy {
    _id: number;
    // fecha: Date;
    fecha: string;
    direccion: string;
    estado: boolean;
    idproveedor: number;
    Proveedor: ApiProvider;
    detalles?: ApiDetail[];
    total?: number;
    // updatedAt: Date
}

export interface Buy {
    id?: number;
    // date: Date;
    date: string;
    direction: string;
    state: boolean;
    idProvider: number;
    provider: Provider;
    detail?: Detail[];
    total?:number;

    //
    amount?: number,
    cost?: number, 
    codProduct?: number, 
    idBranch?: number,
    name?: string,
    subtotal?: number,
}


// View buy show
export interface ApiHeader {
    idcompra: number,
    fecha: string,
    direccion: string,
    "Proveedor.idproveedor": number,
    "Proveedor.nombre": string
}
export interface HeaderH {
    _id: number;
    date: Dayjs;
    direction: string;
    provedorId:number;
    proveedorName: string;
}

export interface ApiHeaderDetail{
    idcompra_detalle: number,
    cantidad: number,
    costo: number,
    "Producto.nombre": string
}

export interface HeaderDetail {
    _id: number;
    amount:number;
    cost: number;
    product: string;
}

export interface ApiHeaderBuy{
    encabezado: ApiHeader,
    detalles: ApiHeaderDetail[]
}

export interface HeaderBuy {
    header: HeaderH,
    details: HeaderDetail[],
}

export type BuyList = Array<Buy>

export type Total = number;