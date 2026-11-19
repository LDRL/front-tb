import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { VariantDetail } from '@/pages/product/models/product.domain.type';
import { PosCartItem, PosSellable } from '../models/pos.types';
import { getActiveVariants, getPresentationPrice, getVariantLabel } from '../utils/posPricing';

interface VariantSelectDialogProps {
  open: boolean;
  sellable: PosSellable | null;
  clientTypeId?: number;
  onClose: () => void;
  onAdd: (item: Omit<PosCartItem, 'id' | 'subtotal' | 'amount'> & { amount?: number }) => boolean | void;
}

const VariantSelectDialog: React.FC<VariantSelectDialogProps> = ({ open, sellable, clientTypeId, onClose, onAdd }) => {
  const product = sellable?.product ?? null;
  const presentation = sellable?.presentation;
  const variants = useMemo(() => (product ? getActiveVariants(product) : []), [product]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  useEffect(() => {
    if (!open || !product) return;
    const firstAvail = variants.find((v) => (v.stock ?? 0) > 0) || variants[0];
    setSelectedVariantId(firstAvail?.idvariante ?? null);
  }, [open, product, variants]);

  if (!product || !presentation) return null;

  const handleAdd = (variant: VariantDetail) => {
    if (variant.idvariante == null) return;
    const price = getPresentationPrice(presentation, clientTypeId, variant.idvariante);
    const label = getVariantLabel(variant);
    const added = onAdd({
      codProductPresentation: presentation.idprodPresenta ?? presentation.idPresentation,
      idvariante: variant.idvariante,
      variantLabel: label,
      productCode: product.productCode,
      name: product.name,
      imageUrl: product.imageUrl,
      brandName: product.brand?.name,
      categoryName: product.category?.name,
      presentationName: presentation.name,
      price,
      basePrice: presentation.price ?? 0,
      precios: presentation.precios,
      preciosVariante: presentation.preciosVariante,
      stock: variant.stock ?? null,
    });
    if (added !== false) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {product.name} ({presentation.name || 'Presentación'})
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Presentación: {presentation.name || 'Predeterminada'} 
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {variants.length === 0 && (
            <Typography variant="body2" color="text.secondary">Este producto no tiene variantes activas.</Typography>
          )}
          {variants.map((variant) => {
            const price = getPresentationPrice(presentation, clientTypeId, variant.idvariante);
            const label = getVariantLabel(variant);
            const stock = variant.stock;
            const outOfStock = stock != null && Number(stock) <= 0;
            const selected = selectedVariantId === variant.idvariante;
            return (
              <Box
                key={variant.idvariante ?? label}
                onClick={() => setSelectedVariantId(variant.idvariante ?? null)}
                sx={{
                  border: '1px solid',
                  borderColor: selected ? 'primary.main' : 'divider',
                  borderRadius: 1.5,
                  p: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  cursor: 'pointer',
                  bgcolor: selected ? 'action.selected' : 'background.paper',
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    SKU: {variant.sku || '-'} · Stock: {variant.stockTexto ?? (stock != null ? stock : 'Sin dato')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                  <Chip size="small" color={outOfStock ? 'default' : 'success'} label={`Q. ${price.toFixed(2)}`} />
                  <Button
                    size="small"
                    variant="contained"
                    disabled={variant.idvariante == null || outOfStock}
                    onClick={(e) => { e.stopPropagation(); handleAdd(variant); }}
                  >
                    Agregar
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VariantSelectDialog;
