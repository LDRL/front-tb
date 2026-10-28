import React from 'react';
import { Box, Typography } from '@mui/material';
import { PosProduct } from '../models/pos.types';

interface ProductCardProps {
  product: PosProduct;
  onClick: () => void;
}

const urlSinImage = "/sinImagen.png";

const getDefaultPresentation = (product: PosProduct) => {
  if (product.presentacions && product.presentacions.length > 0) {
    return product.presentacions[0];
  }
  return null;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const presentation = getDefaultPresentation(product);

  const imageUrl = product.imageUrl || urlSinImage;

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
        '&:active': { transform: 'scale(0.98)' },
        '&:hover': { boxShadow: '0 4px 10px rgba(0,0,0,0.08)', borderColor: '#bdbdbd' }
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: { xs: 110, sm: 130, md: 150 },
          bgcolor: '#f7f7f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {
          <img
            src={imageUrl}
            alt={product.name}
            style={{ width: '60%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        }
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }} noWrap title={product.name}>
          {product.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {product.brand?.name ? `Marca: ${product.brand.name}` : 'Marca: -'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {product.category?.name ? `Categoría: ${product.category.name}` : 'Categoría: -'}
        </Typography>
        {presentation?.name && (
          <Typography variant="caption" color="text.secondary" noWrap>
            Presentación: {presentation.name}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductCard;
