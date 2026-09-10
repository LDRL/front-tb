import { ApiInventario, Inventario, InventarioList } from "../models";

export const InventarioAdapter = (api: ApiInventario): Inventario => ({
    idAlmacen: api.idalmacen,
    idSucursal: api.idsucursal,
    sucursal: api.sucursal,
    codigoProd: api.codigoprod,
    producto: api.producto,
    marca: api.marca,
    categoria: api.categoria,
    unidad: api.unidad,
    presentaciones: api.presentaciones.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        cantidadBase: p.cantidad_base,
        precio: p.precio,
    }))
    .sort((a,b) => b.cantidadBase - a.cantidadBase), //ordenar de mayor a menor referencia cantidadBase
    stock: api.stock,
    stockBase: api.stock_base,
    stockDesglose: api.stock_desglose.map((d) => ({
        id: d.id,
        presentacion: d.presentacion,
        cantidadBase: d.cantidad_base,
        cantidad: d.cantidad,
    }))
    .sort((a,b) => b.cantidadBase - a.cantidadBase), //ordenar de mayor a menor referencia cantidadBase,
    stockMinimo: api.stock_minimo,
    estado: api.estado,
});

export const InventarioListAdapter = (apiList: ApiInventario[]): InventarioList =>
    apiList.map(InventarioAdapter);