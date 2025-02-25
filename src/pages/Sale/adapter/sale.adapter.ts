import { ApiSale, ApiDetail, Sale, Detail } from "../models";

export const SaleAdapter = (sale: ApiSale): Sale => {
    return{
        id: sale._id,
        date: sale.fecha,
        direction: sale.direccion,
        idClient: sale.idcliente,
        total: sale.total,
        client:sale.Cliente ? {
            id: sale.Cliente._id,
            name: sale.Cliente.nombres,
            lastName: sale.Cliente.apellidos,
            telphone: sale.Cliente.telefono,
            email: sale.Cliente.email,
            state: sale.Cliente.estado
            
        }: {id: 0, name: '', lastName: '', telphone: '', email: '', state: ''},
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