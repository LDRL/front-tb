import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export interface SaleVariantOption {
  value: number; // idvariante
  label: string;
  stock?: number | null;
}

export interface SaleProductOption {
  value: number; // idprodPresenta
  label: string;
  price: number;
  hasExpiration: boolean;
  codigoprod: number;
  productName: string;
  presentationName: string;
  tieneVariantes: boolean;
  variantes: SaleVariantOption[];
  stock?: number | null;
  baseQuantity: number;
}

interface ApiProductoVariante {
  idvariante: number;
  sku: string | null;
  estado: number;
  stock?: number | null;
  talla?: { id: number; nombre: string; tipo?: string } | null;
  color?: { id: number; nombre: string; hex?: string | null } | null;
}

interface ApiProductPrice {
  idprecios?: number;
  precio?: string | number;
  tipoprecio?: string;
  idprodPresenta?: number;
  idtipoCli?: number;
  estado?: number;
}

interface ApiProductoPresentacion {
  idprodPresenta: number;
  cantidad_base?: string | number | null;
  precio_venta?: number | string;
  Presentacion?: { _id: number; nombre: string };
  Precios?: ApiProductPrice[];
}

interface ApiProducto {
  codigoprod: number;
  nombre: string;
  controla_vencimiento?: boolean;
  tiene_variantes?: boolean;
  stock?: number | null;
  Marca?: { _id: number; nombre: string };
  Categoria?: { _id: number; nombre: string };
  Presentaciones?: ApiProductoPresentacion[];
  variantes?: ApiProductoVariante[];
}

interface ApiProductosResponse {
  data: ApiProducto[];
}

const variantLabel = (v: ApiProductoVariante): string => {
  const parts: string[] = [];
  if (v.color?.nombre) parts.push(v.color.nombre);
  if (v.talla?.nombre) {
    parts.push(v.talla.tipo ? `${v.talla.nombre} (${v.talla.tipo})` : v.talla.nombre);
  }
  if (v.sku) parts.push(`SKU: ${v.sku}`);
  return parts.length ? parts.join(' - ') : `Variante #${v.idvariante}`;
};

const getPresentationPrice = (presentacion: ApiProductoPresentacion): number => {
  const raw = presentacion.Precios?.length
    ? presentacion.Precios[0].precio
    : presentacion.precio_venta;
  return Number(raw ?? 0);
};

const toNumber = (value: string | number | null | undefined): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const useFetchSaleProductOptions = (search: string, idTipoCli?: number) => {
  return useQuery<SaleProductOption[], Error>({
    queryKey: ['saleProducts', search, idTipoCli],
    queryFn: async () => {
      const base = `${apiUrl}productos`;
      const params = new URLSearchParams();
      if (idTipoCli != null) params.set('idtipoCli', String(idTipoCli));
      if (search) params.set('search', search);
      const qs = params.toString();
      const url = qs ? `${base}?${qs}` : `${base}/`;

      const response = await axiosClient.get<ApiProductosResponse>(url);
      const products = response.data.data || [];

      return products.flatMap((product) => {
        const activeVariantes = (product.variantes || [])
          .filter((v) => v.estado === 1)
          .map((v) => ({ value: v.idvariante, label: variantLabel(v), stock: v.stock ?? null }));

        return (product.Presentaciones || []).map((pres) => ({
          value: pres.idprodPresenta,
          label: `${product.Categoria?.nombre ?? ''} - ${product.Marca?.nombre ?? ''} - ${product.nombre} - ${pres.Presentacion?.nombre ?? ''}`
            .replace(/^(\s*-\s*)+/, '')
            .trim(),
          price: getPresentationPrice(pres),
          hasExpiration: !!product.controla_vencimiento,
          codigoprod: product.codigoprod,
          productName: product.nombre,
          presentationName: pres.Presentacion?.nombre ?? '',
          tieneVariantes: !!product.tiene_variantes,
          variantes: activeVariantes,
          stock: product.stock ?? null,
          baseQuantity: toNumber(pres.cantidad_base),
        }));
      });
    },
    staleTime: 1000 * 60 * 5,
  });
};
