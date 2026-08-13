import { ApiClient } from "@/pages/Client/models";
import { ApiPresentation } from "@/pages/Presentation";

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

export interface ApiState {
    nombre:string;
    idestado: number;
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
    esCotizacion: boolean;
    //cliente?: ApiClientPost;
    pago?: ApiPago;
    Estado: ApiState;
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
    ProductoPresentacion: ApiProductoPresentacion;
    
}

interface ApiProductoPresentacion {
    Presentacion: ApiPresentation;
    Producto: ApiProduct;
}

export interface ApiHeaderSale {
    _id: number,
    nombre: string,
    fecha: string,
    direccion: string,
    total:number,
    idestado: number,
    Cliente: ApiClient,
    Detalles: ApiHeaderDetailSale[]
    Pago: ApiPay | null,
    Estado: ApiState,
}

//Para crear la venta con su detalle

export interface CreateSalePayload {
  nombre: string;
  fecha: string;
  direccion: string;
  idcliente: number;
  idusuario: number;
  idsucursal: number;
  esCotizacion: boolean;
  total: number;

  detalles: CreateSaleDetail[];
  pago?: CreateSalePay;
}

export interface CreateSaleDetail {
  idprodPresenta: number;
  cantidad: number;
  precio: number;
}

export interface CreateSalePay {
    idtipopago: number;
    estado: string;
}