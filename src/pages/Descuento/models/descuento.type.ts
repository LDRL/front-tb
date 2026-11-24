import { Dayjs } from "dayjs";

export type TipoDescuento = "porcentaje" | "monto_fijo";

export interface ApiProductoPresentacionDescuento {
  idprodPresenta: number;
  Producto?: { codigoprod: number; nombre: string };
  Presentacion?: { _id: number; nombre: string };
}

export interface ApiDescuento {
  iddescuentos: number;
  valorDescuento: number | string;
  fechaIni: string | null;
  fechaFin: string | null;
  minimo: number | null;
  idprodPresenta: number;
  estado: number | boolean;
  tipo_descuento: TipoDescuento;
  ProductoPresentacion?: ApiProductoPresentacionDescuento;
}

export interface ApiResponseDescuento {
  message: string;
  data: ApiDescuento[];
  ok: boolean;
  meta: {
    total: number;
    totalPages?: number;
    totalPage?: number;
    currentPage: number;
    limit: number;
  } | null;
}

export interface Descuento {
  id: number;
  value: number;
  startDate: string | null;
  endDate: string | null;
  minimum: number | null;
  productPresentationId: number;
  status: boolean;
  type: TipoDescuento;
  productName: string;
  presentationName: string;
}

export interface DescuentoFormValues {
  id: number;
  productPresentationId: number | null;
  type: TipoDescuento;
  value: number | "";
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  minimum: number | "";
  status: boolean;
  productLabel?: string;
}

export const DescuentoEmptyState: DescuentoFormValues = {
  id: 0,
  productPresentationId: null,
  type: "porcentaje",
  value: "",
  startDate: null,
  endDate: null,
  minimum: "",
  status: true,
};

export type DescuentoList = Descuento[];
