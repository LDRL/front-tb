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

const urlSinImage = "/sinImagen.png";




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
    if (num !== item.amount) {
      onSetAmount(item.id, num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  const imageUrl = item.imageUrl || urlSinImage; 

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 1.5,
        border: '1px solid #eee',
        borderRadius: 2,
        bgcolor: '#fff',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 1.5,
          overflow: 'hidden',
          bgcolor: '#f7f7f7',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        { 
          <img src={imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        }
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ minWidth: 0, pr: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} title={item.name}>
              {item.name}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {item.categoryName && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    Categoría: {item.categoryName}
                  </Typography>
                )}
                {item.brandName && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    Marca: {item.brandName}
                  </Typography>
                )}
                {item.presentationName && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    Presentación: {item.presentationName}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <IconButton size="small" onClick={() => onDecrease(item.id)} sx={{ p: 0.25 }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <TextField
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ''))}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  size="small"
                  inputProps={{ style: { textAlign: 'center', width: 34, padding: '1px 2px' } }}
                />
                <IconButton size="small" onClick={() => onIncrease(item.id)} sx={{ p: 0.25 }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: 0.25 }}>

              
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.15 }}>
                P.U. Q {item.price.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.15, pr: 1 }}>
                Subtotal: Q {item.subtotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          
        </Box>
      </Box>
      <IconButton size="small" color="error" onClick={() => onRemove(item.id)} sx={{ position: 'absolute', top: 2, right: 2 }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default CartItem;
