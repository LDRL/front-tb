import React, { useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { PosCartItem } from '../models/pos.types';

interface CartItemProps {
  item: PosCartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onSetAmount: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
}

const urlSinImage = '/sinImagen.png';

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onSetAmount, onRemove }) => {
  const [inputValue, setInputValue] = useState(String(item.amount));

  React.useEffect(() => {
    setInputValue(String(item.amount));
  }, [item.amount]);

  const handleBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num <= 0) {
      setInputValue(String(item.amount));
      return;
    }

    const stock = item.stock != null ? Math.max(0, Math.floor(Number(item.stock))) : null;
    let corrected = Math.floor(num);
    if (corrected < 1) corrected = 1;
    if (stock != null && corrected > stock) corrected = stock;

    setInputValue(String(corrected));

    if (corrected !== item.amount || corrected !== num) {
      onSetAmount(item.id, num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const subtitle = [item.presentationName || 'Unidad', item.variantLabel].filter(Boolean).join(' · ');

  return (
    <Box
      sx={{
        p: 1.5,
        display: 'flex',
        gap: 1.5,
        borderBottom: '1px solid #f0f0f0',
        bgcolor: '#fff',
        '&:hover': { bgcolor: '#fafafa' },
      }}
    >
      <Box
        component="img"
        src={item.imageUrl || urlSinImage}
        alt={item.name}
        sx={{
          width: 48,
          height: 48,
          objectFit: 'cover',
          borderRadius: 1,
          border: '1px solid #eee',
          bgcolor: '#f9f9f9',
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }} noWrap title={item.name}>
            {item.name}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onRemove(item.id)}
            sx={{ p: 0.25, ml: 0.5, mt: -0.25, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Typography variant="caption" color="text.secondary" noWrap sx={{ mb: 0.5 }} title={subtitle}>
          {subtitle} · Q. {item.price.toFixed(2)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', height: 28 }}>
            <IconButton
              size="small"
              onClick={() => onDecrease(item.id)}
              sx={{ p: 0.5, borderRadius: 0, height: '100%', '&:hover': { bgcolor: '#f0f0f0' } }}
            >
              <RemoveIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <TextField
              variant="standard"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              InputProps={{
                disableUnderline: true,
                sx: {
                  width: 32,
                  input: {
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    p: 0,
                  },
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => onIncrease(item.id)}
              disabled={item.stock != null && item.amount >= Number(item.stock)}
              sx={{ p: 0.5, borderRadius: 0, height: '100%', '&:hover': { bgcolor: '#f0f0f0' } }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Q. {item.subtotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
