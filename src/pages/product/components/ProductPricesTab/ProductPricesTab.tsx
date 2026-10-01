import React from 'react';
import {
  Box, Button, Divider, FormControl, InputLabel,
  MenuItem, Select, TextField, Tooltip, Typography, useMediaQuery, useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { AppIconButton } from '@/components';
import { useFetchTypeClientsOptions } from '@/hooks/useOption';
import { Detail, PrecioCliente } from '../../models/product.domain.type';

const emptyPrecio = (): PrecioCliente => ({
  idtipoCli: 0,
  precio: 0,
  tipoprecio: '',
});

type Props = {
  rows: Detail[];
  updateRowPrecios: (id: string, precios: PrecioCliente[]) => void;
};

export const ProductPricesTab: React.FC<Props> = ({ rows, updateRowPrecios }) => {
  const { data: typeCliOptions = [] } = useFetchTypeClientsOptions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (rows.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Agrega al menos una presentación en la pestaña "Presentaciones" para poder
          configurar sus precios por tipo de cliente.
        </Typography>
      </Box>
    );
  }

  const handleChange = (
    rowId: string,
    current: PrecioCliente[],
    index: number,
    field: keyof PrecioCliente,
    value: string | number
  ) => {
    const updated = [...current];

    if (field === 'idtipoCli') {
      const option = typeCliOptions.find(o => o.value === Number(value));

      updated[index] = {
        ...updated[index],
        idtipoCli: Number(value),
        tipoprecio: option?.label?.toLowerCase() || '',
      };
    } else {
      updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    }

    updateRowPrecios(rowId, updated);
  };

  const handleAdd = (rowId: string, current: PrecioCliente[]) => {
    updateRowPrecios(rowId, [...current, emptyPrecio()]);
  };

  const handleRemove = (rowId: string, current: PrecioCliente[], index: number) => {
    updateRowPrecios(rowId, current.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {rows.map((row) => {
        const precios = row.precios ?? [];

        return (
          <Box
            key={row.id}
            sx={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              p: 2,
              backgroundColor: '#fafafa',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {row.name || 'Presentación'}
            </Typography>

            {precios.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Sin precios por tipo de cliente
              </Typography>
            ) : (
              precios.map((precio, index) => {
                const selectedIds = new Set(
                  precios
                    .filter((_, i) => i !== index)
                    .map(p => p.idtipoCli)
                    .filter(id => id > 0)
                );

                const availableOptions = typeCliOptions.filter(
                  opt => !selectedIds.has(opt.value)
                );

                return (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider sx={{ my: 1.5 }} />}

                    <Box
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        flexDirection: { xs: 'column', sm: 'row' },
                        flexWrap: { sm: 'wrap' },
                      }}
                    >
                      {isMobile && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Tipo cliente
                          </Typography>

                          <Tooltip title="Eliminar">
                            <AppIconButton
                              color="error"
                              onClick={() => handleRemove(row.id!, precios, index)}
                            >
                              <DeleteIcon />
                            </AppIconButton>
                          </Tooltip>
                        </Box>
                      )}

                      <FormControl
                        size="small"
                        sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 180 } }}
                      >
                        <InputLabel>Tipo cliente</InputLabel>
                        <Select
                          label="Tipo cliente"
                          value={precio.idtipoCli || ''}
                          onChange={(e) =>
                            handleChange(row.id!, precios, index, 'idtipoCli', e.target.value)
                          }
                        >
                          {availableOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        size="small"
                        type="number"
                        label="Precio"
                        value={precio.precio || ''}
                        onChange={(e) =>
                          handleChange(row.id!, precios, index, 'precio', e.target.value)
                        }
                        sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 120 } }}
                      />

                      {!isMobile && (
                        <Tooltip title="Eliminar">
                          <AppIconButton
                            color="error"
                            onClick={() => handleRemove(row.id!, precios, index)}
                          >
                            <DeleteIcon />
                          </AppIconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </React.Fragment>
                );
              })
            )}

            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleAdd(row.id!, precios)}
              sx={{ mt: 1 }}
            >
              Agregar precio
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};
