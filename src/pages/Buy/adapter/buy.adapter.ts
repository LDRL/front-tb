import { ApiBuy, ApiDetail, Buy, Detail } from "../models";

export const BuyAdapter = (buy: ApiBuy): Buy => {
    return{
        id: buy._id,
        date: buy.fecha,
        direction: buy.direccion,
        state: buy.estado,
        idProvider: buy.idproveedor,
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