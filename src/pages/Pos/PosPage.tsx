import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import { usePosCart } from './hooks/usePosCart';
import { PosProduct } from './models/pos.types';
import PosCheckoutDialog from './components/PosCheckoutDialog';

const getPriceForClientType = (product: PosProduct, idTypeCli?: number) => {
  if (product.presentacions && product.presentacions.length > 0) {
    const presentation = product.presentacions[0];
    const precios = presentation.precios || [];
    if (idTypeCli && precios.length > 0) {
      const found = precios.find((p) => Number(p.idtipoCli) === Number(idTypeCli));
      if (found && found.precio !== undefined && found.precio !== null) {
        return Number(found.precio);
      }
    }
    if (presentation.price !== undefined && presentation.price !== null) {
      return Number(presentation.price);
    }
  }
  return 0;
};

const PosPage: React.FC = () => {
  const { rows, addItem, increase, decrease, setAmount, removeItem, clearCart, total } = usePosCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [idTypeCli] = useState<number>(1);

  // buildImageUrl not used in this file now

  const handleAddProduct = (product: PosProduct) => {
    if (!product.presentacions || product.presentacions.length === 0) {
      return;
    }
    const presentation = product.presentacions[0];
    const price = getPriceForClientType(product, idTypeCli);
    const codProductPresentation = (presentation.idprodPresenta || presentation.id || `${product.productCode}-${presentation.idPresentation}`);
    const rawImage = (product as any).imageUrl || (product as any).imagen || (presentation as any).imageUrl || (presentation as any).imagen;
    const imageUrl = rawImage;

    addItem({
      codProductPresentation: codProductPresentation as string | number,
      productCode: product.productCode,
      name: product.name,
      imageUrl: imageUrl,
      brandName: product.brand?.name,
      categoryName: product.category?.name,
      presentationName: presentation.name,
      price: price
    });
  };

  const handleSuccess = () => {
    clearCart();
  };

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', p: { xs: 1, sm: 2 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Punto de Venta (POS)</Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona productos para agregar al carrito. Al continuar, se pedirá cliente y forma de pago.
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 2
        }}
      >
        <Box sx={{ height: '100%', minHeight: 0 }}>
          <ProductGrid onAddProduct={handleAddProduct} />
        </Box>
        <Box sx={{ height: '100%', minHeight: 0 }}>
          <CartPanel
            items={rows}
            total={total}
            onIncrease={increase}
            onDecrease={decrease}
            onSetAmount={setAmount}
            onRemove={removeItem}
            onClear={clearCart}
            onContinue={() => setCheckoutOpen(true)}
          />
        </Box>
      </Box>
      <PosCheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={rows}
        total={total}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default PosPage;
