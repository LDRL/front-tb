export type EstadoInventario = "normal" | "bajo" | "sin_stock";

export interface ApiPresentacionInventario {
    id: number;
    nombre: string;
    cantidad_base: number;
    precio: number;
}

export interface ApiStockDesglose {
    id: number;
    presentacion: string;
    cantidad_base: number;
    cantidad: number;
}

export interface ApiInventario {
    idalmacen: string;
    idsucursal: number;
    sucursal: string;
    codigoprod: number;
    producto: string;
    marca: string;
    categoria: string;
    unidad: string;
    presentaciones: ApiPresentacionInventario[];
    stock: number;
    stock_base: string;
    stock_desglose: ApiStockDesglose[];
    stock_minimo: number;
    estado: EstadoInventario;
}