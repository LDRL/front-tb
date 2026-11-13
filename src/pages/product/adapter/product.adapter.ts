import { ApiCreateProduct, ApiProduct } from "../models/product.api.type";
import { Product } from "../models/product.domain.type";
import { ProductForm } from "../models/product.domain.type";

/**
 * The API returns these numerics as strings, and sends null for the ones a
 * presentation has no value for. Number(null) is 0 but Number(undefined) is
 * NaN, and NaN silently survives every `<= 0` guard, so a NaN price would
 * reach the backend. Coerce once, here, where the external shape ends.
 */
const toNumber = (value: string | null | undefined): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};



export const mapApiToProduct = (p: ApiProduct): Product => {
  return {
    productCode: p.codigoprod,
    name: p.nombre,
    description: p.descripcion,
    //price: Number(p.precio),

    brand: {
      id: p.Marca._id,
      name: p.Marca.nombre,
    },

    /*presentation: {
      id: p.Presentacion._id,
      name: p.Presentacion.nombre,
    },*/

    category: {
      id: p.Categoria._id,
      name: p.Categoria.nombre,
    },

    unit: {
      id: p.Unidad._id,
      name: p.Unidad.nombre,
      abbreviation: p.Unidad.abreviatura,
    },

    idBrand: p.idmarca,
    idPresentation: p.idpresentacion,
    idCategory: p.idcategoria,
    idUnit: p.idunidad,
    idPublico: p.idpublico ?? p.Publico?.id ?? null,

    imageUrl: p.imageUrl,
    image: p.imageUrl,

    hasExpiration: !!p.controla_vencimiento,
    hasVariants: !!p.tiene_variantes,
    stockMinimum: p.stock_minimo,
    stock: p.stock ?? null,
    stockTexto: p.stock_texto ?? null,
    stockDetalle: p.stock_detalle ?? null,

    presentacions: p.Presentaciones?.map(pres => ({
      idprodPresenta: pres.idprodPresenta,
      idPresentation: pres.idpresentacion,
      baseQuantity: toNumber(pres.cantidad_base),
      price: toNumber(pres.precio_venta),
      barCode: pres.codigo_barras ?? '',
      name: pres.Presentacion?.nombre || '',
      precios: (pres.Precios || []).map(precio => ({
        idprecios: precio.idprecios,
        idtipoCli: precio.idtipoCli,
        precio: toNumber(precio.precio),
        tipoprecio: precio.tipoprecio,
        idvariante: precio.idvariante ?? null,
      })),
      preciosVariante: (pres.PreciosVariante || []).map(precio => ({
        idprecios: precio.idprecios,
        idtipoCli: precio.idtipoCli,
        precio: toNumber(precio.precio),
        tipoprecio: precio.tipoprecio,
        idvariante: precio.idvariante ?? null,
      })),
    })) || [],

    variantes: (p.variantes || []).map(v => ({
      idvariante: v.idvariante,
      sku: v.sku ?? '',
      estado: v.estado,
      idtalla: v.talla?.id ?? null,
      idcolor: v.color?.id ?? null,
      tallaNombre: v.talla?.nombre ?? null,
      colorNombre: v.color?.nombre ?? null,
      colorHex: v.color?.hex ?? null,
      stock: v.stock ?? null,
      stockTexto: v.stock_texto ?? null,
      varianteTexto: v.variante_texto ?? null,
    })),
  };
};

export function ProductListAdapter(apiProductList: ApiProduct[]): Product[] {
    return apiProductList.map((item) => mapApiToProduct(item as ApiProduct));
}

//No se agrega la imagen porque no es seguro si se manda en el payload por lo que es mejor agregarlo en la UI
export const mapProductToApi = (p: ProductForm): ApiCreateProduct => ({
  nombre: p.name,
  //precio: p.price,
  idcategoria: p.idCategory,
  idmarca: p.idBrand,
  idpresentacion: p.idPresentation,
  idunidad: p.idUnit,
  idpublico: p.idPublico ?? null,
  descripcion: p.description,
  controla_vencimiento: p.hasExpiration,
  tiene_variantes: !!p.hasVariants,
  stock_minimo: p.stockMinimum,
  presentaciones: p.presentacions.map(d => ({
    idpresentacion: d.idPresentation,
    cantidad_base:d.baseQuantity,
    precio_venta:d.price,
    codigo_barras:d.barCode,
    ...(d.idprodPresenta != null ? { idprodPresenta: d.idprodPresenta } : {}),
    ...(d.precios !== undefined ? {
      precios: d.precios.map(p => ({
        idtipoCli: p.idtipoCli,
        precio: p.precio,
        tipoprecio: p.tipoprecio,
        ...(p.idprecios != null ? { idprecios: p.idprecios } : {}),
      }))
    } : {}),
  })),
  ...(p.hasVariants
    ? {
        variantes: (p.variantes || []).map(v => ({
          ...(v.idvariante != null ? { idvariante: v.idvariante } : {}),
          idtalla: v.idtalla ?? null,
          idcolor: v.idcolor ?? null,
          sku: v.sku && String(v.sku).trim() !== '' ? String(v.sku).trim() : null,
          estado: v.estado ?? 1,
        })),
      }
    : { variantes: [] }),
});


export const productFormToProduct = ( form: ProductForm ): Product => {
  return {
    productCode: form.productCode,
    name: form.name,
    description: form.description,

    idBrand: form.idBrand,
    idCategory: form.idCategory,
    idUnit: form.idUnit,
    idPublico: form.idPublico ?? null,

    // Si tu backend necesita objetos completos,
    // aquí puedes llenarlos después con los datos reales
    brand: {
      id: form.idBrand,
      name: '',
    },

    category: {
      id: form.idCategory,
      name: '',
    },

    unit: {
      id: form.idUnit,
      name: '',
      abbreviation: '',
    },

    imageUrl: typeof form.image === 'string'
      ? form.image
      : '',

    image: form.image,

    idPresentation: form.idPresentation,

    price: form.price,
    barCode: form.barCode,
    baseQuantity: form.baseQuantity,

    presentacions: form.presentacions ?? [],
    variantes: form.variantes ?? [],

    hasExpiration: form.hasExpiration,
    hasVariants: !!form.hasVariants,
    stockMinimum: form.stockMinimum
  };
};