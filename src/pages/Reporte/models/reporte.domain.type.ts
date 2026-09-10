import { EstadoInventario } from "./reporte.api.type";

export interface PresentacionInventario {
    id: number;
    nombre: string;
    cantidadBase: number;
    precio: number;
}

export interface StockDesgloseInventario {
    id: number;
    presentacion: string;
    cantidadBase: number;
    cantidad: number;
}

export interface Inventario {
    idAlmacen: string;
    idSucursal: number;
    sucursal: string;
    codigoProd: number;
    producto: string;
    marca: string;
    categoria: string;
    unidad: string;
    presentaciones: PresentacionInventario[];
    stock: number;
    stockBase: string;
    stockDesglose: StockDesgloseInventario[];
    stockMinimo: number;
    estado: EstadoInventario;
}

export type InventarioList = Inventario[];

export interface ReporteInventarioMeta {
    total: number;
    normal: number;
    bajo: number;
    sin_stock: number;
}