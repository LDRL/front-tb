import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { PosSellable } from '../models/pos.types';
import { formatStock, getActiveVariants, getPresentationPrice } from '../utils/posPricing';

interface ProductCardProps {
  sellable: PosSellable;
  clientTypeId?: number;
  onClick: () => void;
}

const urlSinImage = '/sinImagen.png';

const ProductCard: React.FC<ProductCardProps> = ({ sellable, clientTypeId, onClick }) => {
  const { product, presentation } = sellable;
  const imageUrl = product.imageUrl || urlSinImage;
  const price = getPresentationPrice(presentation, clientTypeId, null);
  const hasVariants = !!product.hasVariants;
  const activeVariants = getActiveVariants(product);
  const stockLabel = hasVariants
    ? `${activeVariants.length} var. · Stock ${formatStock(product.stock, product.stockTexto)}`
    : `Stock: ${formatStock(product.stock, product.stockTexto)}`;
  const outOfStock = !hasVariants && product.stock != null && Number(product.stock) <= 0;

  return (
    <Box
      onClick={onClick}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.15s ease-in-out',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        opacity: outOfStock ? 0.7 : 1,
        '&:active': { transform: 'scale(0.98)' },
        '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={imageUrl}
          alt={product.name}
          sx={{
            width: '100%',
            aspectRatio: '1/1',
            objectFit: 'cover',
            bgcolor: '#f9f9f9',
          }}
        />
        {hasVariants && (
          <Chip
            size="small"
            label="Variantes"
            color="primary"
            sx={{ position: 'absolute', top: 6, right: 6, height: 20, fontSize: 10 }}
          />
        )}
      </Box>
      <Box sx={{ p: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, lineHeight: 1.3, color: 'text.primary' }}
          noWrap
          title={product.name}
        >
          {product.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
          {product.brand?.name || 'Sin marca'}
          {product.category?.name ? ` • ${product.category.name}` : ''}
        </Typography>
        <Typography
          variant="caption"
          color={outOfStock ? 'error.main' : 'text.secondary'}
          sx={{ display: 'block' }}
          noWrap
          title={product.stockDetalle || undefined}
        >
          {stockLabel}
        </Typography>
        <Box
          sx={{
            mt: 'auto',
            pt: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              bgcolor: 'action.hover',
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
            }}
            noWrap
            title={presentation.name || 'Unidad'}
          >
            {presentation.name || 'Unidad'}
          </Typography>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
            Q. {Number(price).toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;
