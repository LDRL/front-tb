import { ApiCategory } from '@/pages/Category';
import { ApiBrand } from '@/pages/Brand';

export interface ApiTipoClienteRef {
  idtipoCli: number;
  nombre: string;
  estado: boolean;
}

export interface ApiPrecioCliente {
  idprecios: number;
  precio: string;
  fechaefecto: string | null;
  fechafin: string | null;
  tipoprecio: string;
  idprodPresenta: number;
  idtipoCli: number;
  estado: number;
  createdAt: string;
  updatedAt: string;
  TipoCliente: ApiTipoClienteRef;
  idvariante?: number | null;
}

export interface ApiProductPresentacionResponse {
  idprodPresenta: number;
  codigoprod: number;
  idpresentacion: number;
  cantidad_base: string | null;
  precio_venta: string | null;
  codigo_barras: string | null;
  estado: number;
  Presentacion: {
    _id: number;
    nombre: string;
    estado: boolean;
  };
  Precios?: ApiPrecioCliente[];
  PreciosVariante?: ApiPrecioCliente[];
}

export interface ApiPublicoObjetivo {
  id: number;
  nombre: string;
}

export interface ApiVarianteTalla {
  id: number;
  nombre: string;
  tipo?: string;
}

export interface ApiVarianteColor {
  id: number;
  nombre: string;
  hex?: string | null;
}

export interface ApiProductVarianteResponse {
  idvariante: number;
  sku: string | null;
  estado: number;
  talla: ApiVarianteTalla | null;
  color: ApiVarianteColor | null;
  stock?: number | null;
  stock_texto?: string | null;
  variante_texto?: string | null;
}

export interface ApiProduct {
  codigoprod: number;
  nombre: string;
  descripcion: string;
  //precio: number;
  imagen: string;
  imageUrl: string;

  idmarca: number;
  idpresentacion: number;
  idcategoria: number;
  idunidad: number;
  idpublico?: number | null;
  estado: number;
  controla_vencimiento: boolean;
  tiene_variantes?: boolean;

  Marca: ApiBrand;
  //Presentacion: ApiPresentation;
  Categoria: ApiCategory;
  Unidad: ApiUnidad;
  Publico?: ApiPublicoObjetivo | null;
  Presentaciones?: ApiProductPresentacionResponse[];
  variantes?: ApiProductVarianteResponse[];
  stock_minimo: number;
  stock?: number | null;
  stock_texto?: string | null;
  stock_detalle?: string | null;
}

//Todo cuando se trabaje la vista de unidad
export interface ApiUnidad {
  _id: number;
  nombre: string;
  abreviatura: string;
}

export interface ApiCreateProduct {
  nombre: string;
  //precio: number;
  idcategoria: number;
  idmarca: number;
  idpresentacion: number;
  idunidad: number;
  idpublico?: number | null;
  descripcion: string;
  controla_vencimiento: boolean;
  tiene_variantes: boolean;
  presentaciones: ApiProductPresentacion[];
  variantes?: ApiProductVariante[];
  stock_minimo: number;
}

interface ApiPrecioClienteCreate {
  idtipoCli: number;
  precio: number;
  tipoprecio: string;
  idprecios?: number;
}

interface ApiProductPresentacion {
  idpresentacion: number,
	cantidad_base:number
	precio_venta:number,
	codigo_barras:string,
  idprodPresenta?: number,
  precios?: ApiPrecioClienteCreate[]
}

interface ApiProductVariante {
  idvariante?: number;
  idtalla?: number | null;
  idcolor?: number | null;
  sku?: string | null;
  estado?: number | boolean;
}
