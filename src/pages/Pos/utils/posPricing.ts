import { PosCartItem, PosProduct } from '../models/pos.types';
import { Detail, PrecioCliente, VariantDetail } from '@/pages/product/models/product.domain.type';

export const getPresentationPrice = (
  presentation: Pick<Detail, 'price' | 'precios' | 'preciosVariante'> | undefined,
  idTypeCli?: number,
  idvariante?: number | null
): number => {
  if (!presentation) return 0;

  if (idvariante != null) {
    const pvSpecific = (presentation.preciosVariante || []).find(
      (p) => Number(p.idvariante) === Number(idvariante) && idTypeCli != null && Number(p.idtipoCli) === Number(idTypeCli)
    );
    if (pvSpecific && pvSpecific.precio != null) return Number(pvSpecific.precio);

    const pvAnyClient = (presentation.preciosVariante || []).find(
      (p) => Number(p.idvariante) === Number(idvariante)
    );
    if (pvAnyClient && pvAnyClient.precio != null) return Number(pvAnyClient.precio);
  }

  if (idTypeCli != null) {
    const found = (presentation.precios || []).find((p) => Number(p.idtipoCli) === Number(idTypeCli));
    if (found && found.precio != null) return Number(found.precio);
  }
  if (presentation.price != null) return Number(presentation.price);
  const first = (presentation.precios || [])[0];
  return first?.precio != null ? Number(first.precio) : 0;
};

export const getVariantLabel = (variant: VariantDetail): string => {
  if (variant.varianteTexto) return variant.varianteTexto;
  const parts = [variant.colorNombre, variant.tallaNombre].filter(Boolean);
  if (parts.length) return parts.join(' - ');
  if (variant.sku) return `SKU ${variant.sku}`;
  return `Variante #${variant.idvariante ?? ''}`.trim();
};

export const getDefaultPresentation = (product: PosProduct): Detail | undefined => {
  return product.presentacions?.[0];
};

export const getProductDisplayPrice = (product: PosProduct, idTypeCli?: number): number => {
  const pres = getDefaultPresentation(product);
  return getPresentationPrice(pres, idTypeCli, null);
};

export const getActiveVariants = (product: PosProduct): VariantDetail[] => {
  return (product.variantes || []).filter((v) => Number(v.estado) === 1);
};

export const formatStock = (stock?: number | null, stockTexto?: string | null): string => {
  if (stockTexto) return stockTexto;
  if (stock == null) return 'Sin dato';
  return String(stock);
};

export const calcSubtotal = (price: number, amount: number) => Number((price * amount).toFixed(2));

export const repriceCartItems = (items: PosCartItem[], idTypeCli?: number): PosCartItem[] =>
  items.map((item) => {
    const price = getPresentationPrice(
      {
        price: item.basePrice ?? item.price,
        precios: item.precios as PrecioCliente[] | undefined,
        preciosVariante: item.preciosVariante as PrecioCliente[] | undefined,
      },
      idTypeCli,
      item.idvariante
    );
    return {
      ...item,
      price,
      subtotal: calcSubtotal(price, item.amount),
    };
  });
