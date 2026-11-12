import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';

const apiUrl = import.meta.env.VITE_API_URL;

export interface BuyVariantOption {
  value: number; // idvariante
  label: string;
}

export interface BuyProductOption {
  value: number; // idprodPresenta
  label: string;
  hasExpiration: boolean;
  codigoprod: number;
  productName: string;
  presentationName: string;
  tieneVariantes: boolean;
  variantes: BuyVariantOption[];
}

interface ApiProductoVariante {
  idvariante: number;
  sku: string | null;
  estado: number;
  talla?: { id: number; nombre: string; tipo?: string } | null;
  color?: { id: number; nombre: string; hex?: string | null } | null;
}

interface ApiProductoPresentacion {
  idprodPresenta: number;
  Presentacion?: { _id: number; nombre: string };
}

interface ApiProducto {
  codigoprod: number;
  nombre: string;
  controla_vencimiento?: boolean;
  tiene_variantes?: boolean;
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

export const useFetchBuyProductOptions = (search: string) => {
  return useQuery<BuyProductOption[], Error>({
    queryKey: ['buyProducts', search],
    queryFn: async () => {
      const url = search
        ? `${apiUrl}productos?search=${encodeURIComponent(search)}`
        : `${apiUrl}productos/`;
      const response = await axiosClient.get<ApiProductosResponse>(url);
      const products = response.data.data || [];
      return products.flatMap((product) => {
        const activeVariantes = (product.variantes || [])
          .filter((v) => v.estado === 1)
          .map((v) => ({ value: v.idvariante, label: variantLabel(v) }));

        return (product.Presentaciones || []).map((pres) => ({
          value: pres.idprodPresenta,
          label: `${product.Categoria?.nombre ?? ''} - ${product.Marca?.nombre ?? ''} - ${product.nombre} - ${pres.Presentacion?.nombre ?? ''}`.replace(/^(\s*-\s*)+/, '').trim(),
          hasExpiration: !!product.controla_vencimiento,
          codigoprod: product.codigoprod,
          productName: product.nombre,
          presentationName: pres.Presentacion?.nombre ?? '',
          tieneVariantes: !!product.tiene_variantes,
          variantes: activeVariantes,
        }));
      });
    },
    staleTime: 1000 * 60 * 5,
  });
};
