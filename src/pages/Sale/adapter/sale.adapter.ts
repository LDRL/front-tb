import dayjs from "dayjs";
import { ApiDetail, ApiHeaderSale, ApiSale, CreateSalePayload } from "../models/sale.api.type";
import { ApiClient } from "@/pages/Client/models/client.api.type";
import { Detail, Sale } from "../models/sale.domain.type";
import { HeaderSale } from "../models/sale.view.type";
import { Client } from "@/pages/Client/models/client.domain.type";

export const SaleAdapter = (sale: ApiSale): Sale => {
    return{
        id: sale._id,
        name: sale.nombre,
        date: sale.fecha,
        address: sale.direccion,
        idClient: sale.idcliente,
        idUser: sale.idusuario,
        idSucursal: sale.idsucursal,
        total: sale.total,
        client:sale.Cliente ? {
            id: sale.Cliente._id,
            name: sale.Cliente.nombres,
            lastName: sale.Cliente.apellidos,
            telphone: sale.Cliente.telefono,
            email: sale.Cliente.email,
            state: sale.Cliente.estado,
            nit: sale.Cliente.nit,
            address: sale.Cliente.direccion
            
        }: {id: 0, name: '', lastName: '', telphone: '', email: '', state: '', nit:'', address: ''},
        // state: sale.estado,

        details: sale.detalles && sale.detalles.length > 0
        ? sale.detalles.map((d: ApiDetail): Detail => ({
            amount: d.cantidad,
            cost: d.precio,
            codProduct: d.codigoprod,
        }))
        : []
    }
}

export function SaleListAdapter(apiSaleList: ApiSale[]): Sale[] {
    return apiSaleList.map(SaleAdapter);
}

//SHOW HeaderSale
export const HeaderSaleAdapter = (sale: ApiHeaderSale): HeaderSale =>{
    return {
        header: {
            id: sale._id,
            date: dayjs(sale.fecha),
            address: sale.direccion,
            name: sale.nombre,
            total: sale.total,
            nit: sale.Cliente.nit,
            pay:sale.Pago.estado,
        },
        details: (sale.Detalles ?? []).map((d) => ({
            id: d._id,
            amount: d.cantidad,
            cost: d.precio,
            product: d.Producto?.nombre ?? "",
        })),
        
        pay:sale.Pago ? {
            _id: sale.Pago.idpagos,
            amount: sale.Pago.importe,
            idOrden: sale.Pago.idorden,
            idPaymentType: sale.Pago.idtipopago,
            paymentDate: dayjs(sale.Pago.fecha_pago),
            
        }: {_id: 0, amount:0, idOrden:0, idPaymentType:0, paymentDate:dayjs()},
    }
}


//Todo cambiar a adapter Client
export const SaleClientAdapter = (client: ApiClient): Client => {
    return{
        id: client._id,
        name: client.nombres,
        lastName: client.apellidos,
        telphone: client.telefono,
        email: client.email,
        state: client.estado,
        nit: client.nit,
        address: client.direccion
    }
}

//Mandar a guardar una venta

export const mapSaleToCreatePayload = (
  sale: Sale,
  idusuario: number,
  idsucursal: number
): CreateSalePayload => ({
  nombre: sale.name,
  fecha: sale.date,
  direccion: sale.address,
  
  idcliente: sale.idClient,
  idusuario,
  idsucursal,
  total: sale.total ?? 0,

  detalles: sale.details.map(d => ({
    codigoprod: d.codProduct,
    cantidad: d.amount,
    precio: d.cost,
  })),
  pago: {
    idtipopago: 1,
    estado: "Pagado"
  }
});