import dayjs from "dayjs";
import { ApiBuy, ApiDetail, ApiHeaderBuy, ApiHeaderDetail, Buy, Detail, HeaderBuy, HeaderDetail } from "../models";

export const BuyAdapter = (buy: ApiBuy): Buy => {
    return{
        id: buy._id,
        date: buy.fecha,
        direction: buy.direccion,
        state: buy.estado,
        idProvider: buy.idproveedor,
        total: buy.total,
        provider: buy.Proveedor ? {
            id: buy.Proveedor._id,
            name: buy.Proveedor.nombre,
            direction: buy.Proveedor.direccion,
            telphone: buy.Proveedor.telefono,
            email: buy.Proveedor.email,
            state: buy.Proveedor.estado
            
        }: {id: 0, name: '', direction: '', telphone: '', email: '', state: ''},

        detail: buy.detalles && buy.detalles.length > 0
        ? buy.detalles.map((d: ApiDetail): Detail => ({
            amount: d.cantidad,
            cost: d.costo,
            codProduct: d.codigoprod,
            idBranch: d.idsucursal
        }))
        : []
    }
}

export function BuyListAdapter(apiBuyList: ApiBuy[]): Buy[] {
    return apiBuyList.map(BuyAdapter);
}

export const HeaderBuyAdapter = (buy: ApiHeaderBuy): HeaderBuy =>{
    return {
        header: buy.encabezado ? {
            _id: buy.encabezado.idcompra,
            date: dayjs(buy.encabezado.fecha),
            direction:buy.encabezado.direccion,
            provedorId: buy.encabezado["Proveedor.idproveedor"],
            proveedorName: buy.encabezado["Proveedor.nombre"]
        }: {_id: 0, date: dayjs(), direction: '', provedorId: 0, proveedorName: ''},
        details: buy.detalles && buy.detalles.length > 0 
        ?  buy.detalles.map((d: ApiHeaderDetail): HeaderDetail => ({
            _id: d.idcompra_detalle,
            amount:d.cantidad,
            cost:d.costo,
            product:d["Producto.nombre"],
        }))
        :[]
    }
}