import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import { usePosCart } from './hooks/usePosCart';
import { PosSellable } from './models/pos.types';
import PosCheckoutDialog from './components/PosCheckoutDialog';
import VariantSelectDialog from './components/VariantSelectDialog';
import { getActiveVariants, getPresentationPrice } from './utils/posPricing';
import { useFetchTypeClientsOptions } from '@/hooks/useOption';

const PosPage: React.FC = () => {
  const { rows, addItem, increase, decrease, setAmount, removeItem, reprice, clearCart, total } = usePosCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [variantSellable, setVariantSellable] = useState<PosSellable | null>(null);
  const [clientTypeId, setClientTypeId] = useState<number | undefined>(undefined);
  const { data: clientTypeOptions = [] } = useFetchTypeClientsOptions();

  useEffect(() => {
    if (clientTypeId != null || clientTypeOptions.length === 0) return;
    const minorista = (clientTypeOptions as { value: number; label: string }[]).find((o) =>
      /minor/i.test(o.label || '')
    );
    // Default: minorista si existe, sino precio de venta (base)
    if (minorista) {
      setClientTypeId(Number(minorista.value));
    } else {
      setClientTypeId(undefined);
    }
  }, [clientTypeId, clientTypeOptions]);

  // Reprice cart whenever client type changes (prevents showing/paying mismatched prices)
  useEffect(() => {
    reprice(clientTypeId);
  }, [clientTypeId, reprice]);

  const handleClientTypeChange = (id: number) => {
    setClientTypeId(id);
  };

  const handleAddSellable = (sellable: PosSellable) => {
    const { product, presentation } = sellable;

    if (product.hasVariants) {
      const active = getActiveVariants(product);
      if (active.length === 0) {
        toast.info('Este producto no tiene variantes activas disponibles');
        return;
      }
      setVariantSellable(sellable);
      return;
    }

    const price = getPresentationPrice(presentation, clientTypeId, null);

    addItem({
      codProductPresentation: presentation.idprodPresenta ?? presentation.idPresentation,
      idvariante: null,
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
      stock: product.stock ?? null,
    });
  };

  const handleAddVariantItem: React.ComponentProps<typeof VariantSelectDialog>['onAdd'] = (item) => {
    addItem(item);
  };

  const checkoutItems = useMemo(() => rows, [rows]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        flex: 1,
        minHeight: 0,
        height: '100%',
        maxHeight: '100%',
        gap: 2,
        overflow: 'hidden',
        p: { xs: 1, md: 2 }
      }}
    >
      <Box sx={{ flex: { xs: '1 1 auto', lg: '1 1 0' }, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>Punto de venta</Typography>
        </Box>
        <ProductGrid
          clientTypeId={clientTypeId}
          clientTypeOptions={clientTypeOptions as { value: number; label: string }[]}
          onClientTypeChange={handleClientTypeChange}
          onAddSellable={handleAddSellable}
        />
      </Box>

      <Box
        sx={{
          width: { xs: '100%', lg: 360, xl: 400 },
          flexShrink: 0,
          minHeight: 0,
          height: { xs: '45%', lg: '100%' },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CartPanel
          items={checkoutItems}
          total={total}
          onIncrease={increase}
          onDecrease={decrease}
          onSetAmount={setAmount}
          onRemove={removeItem}
          onClear={clearCart}
          onContinue={() => setCheckoutOpen(true)}
        />
      </Box>

      <VariantSelectDialog
        open={!!variantSellable}
        sellable={variantSellable}
        clientTypeId={clientTypeId}
        onClose={() => setVariantSellable(null)}
        onAdd={handleAddVariantItem}
      />

      <PosCheckoutDialog
        open={checkoutOpen}
        items={checkoutItems}
        total={total}
        clientTypeId={clientTypeId}
        onClientTypeChange={handleClientTypeChange}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={clearCart}
      />
    </Box>
  );
};

export default PosPage;
