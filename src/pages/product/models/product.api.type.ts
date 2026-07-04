import { ApiPresentation } from '@/pages/Presentation';
import { ApiCategory } from '@/pages/Category';
import { ApiBrand } from '@/pages/Brand';

export interface ApiProductPresentacionResponse {
  idprodPresenta: number;
  codigoprod: number;
  idpresentacion: number;
  cantidad_base: string;
  precio_venta: string;
  codigo_barras: string;
  estado: number;
  Presentacion: {
    _id: number;
    nombre: string;
    estado: boolean;
  };
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
  estado: number;

  Marca: ApiBrand;
  //Presentacion: ApiPresentation;
  Categoria: ApiCategory;
  Unidad: ApiUnidad;
  Presentaciones?: ApiProductPresentacionResponse[];
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
  descripcion: string;
  presentaciones: ApiProductPresentacion[];
}

interface ApiProductPresentacion {
  idpresentacion: number,
	cantidad_base:number
	precio_venta:number,
	codigo_barras:string,
  idprodPresenta?: number
}
