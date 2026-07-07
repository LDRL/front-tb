import dayjs from "dayjs";
import { ApiDetail, ApiHeaderSale, ApiSale, CreateSalePayload } from "../models/sale.api.type";
import { Detail, Sale } from "../models/sale.domain.type";
import { HeaderSale } from "../models/sale.view.type";
import { ClientAdapter } from "@/pages/Client/adapter";
import { Client } from "@/pages/Client/models";

const defaultClient = (): Client => ({
    id: 0,
    nit: "",
    name: "",
    lastName: "",
    direccion: "",
    email: "",
    telefono: "",
    estado: 1,
});

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
        client: sale.Cliente ? ClientAdapter(sale.Cliente) : defaultClient(),

        details: sale.detalles && sale.detalles.length > 0
        ? sale.detalles.map((d: ApiDetail): Detail => ({
            amount: d.cantidad,
            cost: d.precio,
            codProductPresentation: d.codigoprod,
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
            product: `${d.ProductoPresentacion.Producto.nombre} - ${d.ProductoPresentacion.Presentacion.nombre}`
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
    idprodPresenta: d.codProductPresentation,
    cantidad: d.amount,
    precio: d.cost,
  })),
  pago: {
    idtipopago: 1,
    estado: "Pagado"
  }
});
