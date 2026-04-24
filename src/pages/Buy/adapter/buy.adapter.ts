import dayjs from "dayjs";
import { ApiBuy, ApiDetail, ApiHeaderBuy, CreateBuyPayload } from "../models/buy.api.type";
import { Buy, Detail } from "../models/buy.domain.type";
import { HeaderBuy } from "../models/buy.view.type";

export const BuyAdapter = (buy: ApiBuy): Buy => {
    return{
        id: buy._id,
        name: buy.nombre,
        date: buy.fecha,
        address: buy.direccion,
        state: buy.estado,
        idProvider: buy.idproveedor,
        idSucursal: buy.idsucursal,
        idUser: buy.idusuario,
        total: buy.total,
        provider: buy.Proveedor ? {
            id: buy.Proveedor._id,
            name: buy.Proveedor.nombre,
            address: buy.Proveedor.direccion,
            phone: buy.Proveedor.telefono,
            email: buy.Proveedor.email,
            state: buy.Proveedor.estado
            
        }: {id: 0, name: '', address: '', phone: '', email: '', state: ''},

        details: (buy.Detalles ?? []).map((d: ApiDetail): Detail => ({
            amount: d.cantidad,
            cost: d.costo,
            codProduct: d.codigoprod,
            subtotal: d.cantidad * d.costo,
        })),
    }
}

export function BuyListAdapter(apiBuyList: ApiBuy[]): Buy[] {
    return apiBuyList.map(BuyAdapter);
}

export const HeaderBuyAdapter = (buy: ApiHeaderBuy): HeaderBuy => {
    return {
        header: {
            id: buy._id,
            date: dayjs(buy.fecha),
            address: buy.direccion,
            providerId: buy.idproveedor,
            providerName: buy.Proveedor?.nombre ?? "",
        },

        details: (buy.Detalles ?? []).map((d) => ({
            id: d._id,
            amount: d.cantidad,
            cost: Number(d.costo),
            product: d.Producto?.nombre ?? "",
        })),
    };
};

//Adapter para crear la compra


export const mapBuyToCreatePayload = (
  buy: Buy,
  idusuario: number,
  idsucursal: number
): CreateBuyPayload => ({
  nombre: buy.name,
  fecha: buy.date,
  direccion: buy.address,
  estado: buy.state,
  idproveedor: buy.idProvider,
  idusuario,
  idsucursal,
  total: buy.total ?? 0,

  detalles: buy.details.map(d => ({
    codigoprod: d.codProduct,
    cantidad: d.amount,
    costo: d.cost,
  })),
});