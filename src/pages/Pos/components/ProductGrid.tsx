import React, { useMemo, useState } from 'react';
import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useGetProducts } from '@/pages/product/hooks/useProduct';
import { PosProduct, PosSellable } from '../models/pos.types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  clientTypeId?: number;
  clientTypeOptions?: { value: number; label: string }[];
  onClientTypeChange?: (id: number) => void;
  onAddSellable: (sellable: PosSellable) => void;
}

const buildSellables = (products: PosProduct[]): PosSellable[] => {
  const out: PosSellable[] = [];
  for (const product of products) {
    const pres = product.presentacions || [];
    for (const p of pres) {
      const presId = p.idprodPresenta ?? p.idPresentation;
      out.push({
        key: `${product.productCode}-${presId}`,
        product,
        presentation: p,
      });
    }
  }
  return out;
};

const ProductGrid: React.FC<ProductGridProps> = ({ clientTypeId, clientTypeOptions = [], onClientTypeChange, onAddSellable }) => {
  const { products, isLoading } = useGetProducts(1);
  const [search, setSearch] = useState('');

  const sellables = useMemo(() => buildSellables((products as unknown as PosProduct[]) || []), [products]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sellables;
    const term = search.toLowerCase();
    return sellables.filter((s) => {
      const p = s.product;
      const brand = p.brand?.name?.toLowerCase() || '';
      const category = p.category?.name?.toLowerCase() || '';
      const name = p.name?.toLowerCase() || '';
      const pres = s.presentation.name?.toLowerCase() || '';
      const code = String(p.productCode || '').toLowerCase();
      return name.includes(term) || brand.includes(term) || category.includes(term) || code.includes(term) || pres.includes(term);
    });
  }, [sellables, search]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, marca, categoría, código o presentación"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: '1 1 260px' }}
        />
        {clientTypeOptions.length > 0 && (
          <TextField
            select
            size="small"
            label="Tipo de cliente (precios)"
            value={clientTypeId ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || v == null) return;
              onClientTypeChange?.(Number(v));
            }}
            sx={{ minWidth: 220 }}
          >
            {!clientTypeOptions.some((o) => /minor/i.test(o.label || '')) && (
              <MenuItem value="">
                <em>Precio de venta (base)</em>
              </MenuItem>
            )}
            {clientTypeOptions.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>
        )}
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
        {isLoading && (
          <Typography variant="body2" color="text.secondary">
            Cargando productos...
          </Typography>
        )}
        {!isLoading && filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No se encontraron productos
          </Typography>
        )}
        <Grid container spacing={1.5}>
          {filtered.map((sellable) => (
            <Grid item xs={6} sm={4} md={4} lg={3} xl={2.4} key={sellable.key}>
              <ProductCard sellable={sellable} clientTypeId={clientTypeId} onClick={() => onAddSellable(sellable)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductGrid;
