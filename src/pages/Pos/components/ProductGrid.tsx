import React, { useMemo, useState } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { useGetProducts } from '@/pages/product/hooks/useProduct';
import { PosProduct } from '../models/pos.types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  onAddProduct: (product: PosProduct) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddProduct }) => {
  const { products, isLoading } = useGetProducts(1);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const list = (products as unknown as PosProduct[]) || [];
    if (!search.trim()) return list;
    const term = search.toLowerCase();
    return list.filter((p) => {
      const brand = p.brand?.name?.toLowerCase() || '';
      const category = p.category?.name?.toLowerCase() || '';
      const name = p.name?.toLowerCase() || '';
      const code = String(p.productCode || '').toLowerCase();
      return name.includes(term) || brand.includes(term) || category.includes(term) || code.includes(term);
    });
  }, [products, search]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar producto por nombre, marca, categoría o código"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
          {filtered.map((product) => (
            <Grid item xs={6} sm={4} md={4} lg={3} xl={2.4} key={product.productCode}>
              <ProductCard product={product} onClick={() => onAddProduct(product)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductGrid;
