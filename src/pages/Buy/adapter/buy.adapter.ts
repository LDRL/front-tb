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
            codProductPresentation: d.codigoprod,
            idvariante: d.idvariante ?? null,
            subtotal: d.cantidad * d.costo,
        })),
    }
}

export function BuyListAdapter(apiBuyList: ApiBuy[]): Buy[] {
    return apiBuyList.map(BuyAdapter);
}

const variantLabelFromHeaderDetail = (d: any): string | undefined => {
  const v = d?.Variante;
  if (v) {
    const parts: string[] = [];
    if (v.Color?.nombre) parts.push(v.Color.nombre);
    if (v.Talla?.nombre) parts.push(v.Talla.tipo ? `${v.Talla.nombre} (${v.Talla.tipo})` : v.Talla.nombre);
    if (v.sku) parts.push(`SKU: ${v.sku}`);
    if (parts.length) return parts.join(' - ');
    if (v.idvariante != null) return `Variante #${v.idvariante}`;
  }
  if (d?.idvariante != null) return `Variante #${d.idvariante}`;
  return undefined;
};

export const HeaderBuyAdapter = (buy: ApiHeaderBuy): HeaderBuy => {
    return {
        header: {
            id: buy._id,
            date: dayjs(buy.fecha),
            address: buy.direccion,
            providerId: buy.idproveedor,
            providerName: buy.Proveedor?.nombre ?? "",
            total: buy.total,
        },

        details: (buy.Detalles ?? []).map((d) => ({
            id: d._id,
            amount: `${d.cantidad} - ${d.ProductoPresentacion.Presentacion.nombre}`,
            quantity: Number(d.cantidad),
            cost: Number(d.costo),
            subtotal: Number((Number(d.cantidad) * Number(d.costo)).toFixed(2)),
            product: d.ProductoPresentacion.Producto.nombre,
            variant: variantLabelFromHeaderDetail(d),
        })),
    };
};

//Adapter para crear la compra


export const mapBuyToCreatePayload = (buy: Buy,idusuario: number, idsucursal: number ): CreateBuyPayload => ({
  nombre: buy.name,
  fecha: buy.date,
  direccion: buy.address,
  estado: buy.state,
  idproveedor: buy.idProvider,
  idusuario,
  idsucursal,
  total: buy.total ?? 0,
  ...(buy.idCaja ? { idcaja: buy.idCaja } : {}),

  detalles: buy.details.map(d => ({
    idprodPresenta: d.codProductPresentation,
    idvariante: d.idvariante ?? null,
    cantidad: d.amount,
    costo: d.cost,
    ...(d.expirationDate ? { fecha_vencimiento: d.expirationDate } : {}),
  })),
  ...(buy.idTypePay
    ? {
        pago: {
          idtipopago: buy.idTypePay,
          estado: buy.paymentStatus ?? 'Pendiente',
        },
      }
    : {}),
});


export const toDecimal = (value: number | string, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(Number(value) * factor) / factor;
};