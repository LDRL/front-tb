import { ApiClient, ApiClientPost } from "@/pages/Client/models/client.api.type";

export interface ApiDetail {
    cantidad: number,
    precio: number,
    codigoprod: number,
    nombre?: string,
}


interface ApiPago {
    estado:string;
    idtipopago: number;
}

export interface ApiSale {
    _id: number;
    // fecha: Date;
    nombre: string;
    fecha: string;
    direccion: string;
    idcliente: number;
    Cliente: ApiClient;
    detalles?: ApiDetail[];
    total?:number;
    idsucursal: number;
    idusuario: string;
    //cliente?: ApiClientPost;
    pago?: ApiPago;
}


export interface ApiPay {
    idpagos: number,
    importe: number,
    idorden: number,
    idtipopago: number,
    fecha_pago: string,
    estado: string,
}


interface ApiProduct {
    _id : number,
    codigoprod: number,
    nombre: string,
}

export interface ApiHeaderDetailSale{
    _id: number,
    cantidad: number,
    precio: number,    
    Producto: ApiProduct,
    
}

export interface ApiHeaderSale {
    _id: number,
    nombre: string,
    fecha: string,
    direccion: string,
    total:number,
    Cliente: ApiClient,
    Detalles: ApiHeaderDetailSale[]
    Pago: ApiPay,
}

//Para crear la venta con su detalle

export interface CreateSalePayload {
  nombre: string;
  fecha: string;
  direccion: string;
  idcliente: number;
  idusuario: number;
  idsucursal: number;
  total: number;

  detalles: CreateSaleDetail[];
  pago: CreateSalePay;
}

export interface CreateSaleDetail {
  codigoprod: number;
  cantidad: number;
  precio: number;
}

interface CreateSalePay {
    idtipopago: number;
    estado:string;
}