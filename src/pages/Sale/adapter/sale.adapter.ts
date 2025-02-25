import dayjs from "dayjs";
import { ApiSale, ApiDetail, Sale, Detail, ApiHeaderSale, HeaderSale, ApiHeaderDetailSale, HeaderDetailSale } from "../models";

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

//SHOW HeaderSale
export const HeadeSaleAdapter = (sale: ApiHeaderSale): HeaderSale =>{
    return {
        _id: sale._id,
        date: dayjs(sale.fecha),
        direction: sale.direccion,
        total: sale.total,
        client:sale.Cliente ? {
            id: sale.Cliente._id,
            name: sale.Cliente.nombres,
            lastName: sale.Cliente.apellidos,
            telphone: sale.Cliente.telefono,
            email: sale.Cliente.email,
            state: sale.Cliente.estado
            
        }: {id: 0, name: '', lastName: '', telphone: '', email: '', state: ''},
        details: sale.Detalles && sale.Detalles.length > 0 
        ?  sale.Detalles.map((d: ApiHeaderDetailSale): HeaderDetailSale => ({
            _id: d._id,
            amount:d.cantidad,
            cost:d.precio,
            productCode: d.codigoprod,
            product: d.Producto ? {
                _id: d.Producto._id,
                productCode: d.Producto.codigoprod,
                name: d.Producto.nombre,
            }: {_id:0, productCode: 0, name:''},
        }))
        :[],
        pay:sale.Pago ? {
            _id: sale.Pago.idpagos,
            amount: sale.Pago.importe,
            idOrden: sale.Pago.idorden,
            idPaymentType: sale.Pago.idtipopago,
            paymentDate: dayjs(sale.Pago.fecha_pago),
            
        }: {_id: 0, amount:0, idOrden:0, idPaymentType:0, paymentDate:dayjs()},
    }
}

// export interface HeaderSale {
//     _id: number;
//     date: Dayjs;
//     direction: string;
//     total: number
//     client:Client;
//     details: HeaderDetailSale[]
//     pay: Pay;
// }