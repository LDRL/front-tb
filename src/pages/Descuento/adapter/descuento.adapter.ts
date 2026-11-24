import dayjs from "dayjs";
import { ApiDescuento, Descuento, DescuentoFormValues } from "../models";

export const DescuentoAdapter = (item: ApiDescuento): Descuento => {
  const productName = item.ProductoPresentacion?.Producto?.nombre ?? "";
  const presentationName = item.ProductoPresentacion?.Presentacion?.nombre ?? "";

  return {
    id: item.iddescuentos,
    value: Number(item.valorDescuento ?? 0),
    startDate: item.fechaIni ?? null,
    endDate: item.fechaFin ?? null,
    minimum: item.minimo === null || item.minimo === undefined ? null : Number(item.minimo),
    productPresentationId: Number(item.idprodPresenta),
    status: Number(item.estado) === 1 || item.estado === true,
    type: item.tipo_descuento,
    productName,
    presentationName,
  };
};

export const DescuentoListAdapter = (items: ApiDescuento[]): Descuento[] =>
  items.map(DescuentoAdapter);

export const DescuentoToFormAdapter = (item: ApiDescuento): DescuentoFormValues => {
  const adapted = DescuentoAdapter(item);
  return {
    id: adapted.id,
    productPresentationId: adapted.productPresentationId,
    type: adapted.type,
    value: adapted.value,
    startDate: adapted.startDate ? dayjs(adapted.startDate) : null,
    endDate: adapted.endDate ? dayjs(adapted.endDate) : null,
    minimum: adapted.minimum ?? "",
    status: adapted.status,
    productLabel: [adapted.productName, adapted.presentationName].filter(Boolean).join(" - ") || undefined,
  };
};
