import { ApiSale, ApiDetail, Sale, Detail } from "../models";

export const SaleAdapter = (sale: ApiSale): Sale => {
    return{
        id: sale._id,
        date: sale.fecha,
        direction: sale.direccion,
        // state: sale.estado,

        detail: sale.detalles && sale.detalles.length > 0
        ? sale.detalles.map((d: ApiDetail): Detail => ({
            amount: d.cantidad,
            cost: d.precio,
            codProduct: d.codigoprod,
            idBranch: d.idsucursal
        }))
        : []
    }
}

export function SaleListAdapter(apiSaleList: ApiSale[]): Sale[] {
    return apiSaleList.map(SaleAdapter);
}