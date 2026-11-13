import React from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { PosCartItem } from '../models/pos.types';
import CartItem from './CartItem';

interface CartPanelProps {
  items: PosCartItem[];
  total: number;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onSetAmount: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onContinue: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({
  items,
  total,
  onIncrease,
  onDecrease,
  onSetAmount,
  onRemove,
  onClear,
  onContinue
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        bgcolor: '#fafafa',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon />
          <Typography variant="h6">Carrito</Typography>
        </Box>
        {items.length > 0 && (
          <Button size="small" color="error" onClick={onClear}>
            Vaciar
          </Button>
        )}
      </Box>
      <Divider />
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {items.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
              <Typography variant="body2">No hay productos agregados</Typography>
              <Typography variant="caption">Presiona un producto para agregarlo al carrito</Typography>
            </Box>
          )}
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onSetAmount={onSetAmount}
              onRemove={onRemove}
            />
          ))}
        </Box>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">Total</Typography>
            <Typography variant="h6">Q {total.toFixed(2)}</Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            disabled={items.length === 0}
            onClick={onContinue}
            sx={{ borderRadius: 2 }}
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CartPanel;
