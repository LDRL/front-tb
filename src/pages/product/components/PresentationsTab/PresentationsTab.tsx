import React, { useMemo, useState } from 'react';
import {
  Autocomplete, Box, IconButton, TextField, Tooltip, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import debounce from 'just-debounce-it';
import { AppIconButton } from '@/components';
import { Option, useFetchPresentacionOptions } from '@/hooks/useOption';
import { Detail, RowErrors } from '../../models/product.domain.type';

type BlockProps = {
  detail: Detail;
  errors: RowErrors;
  onChange: (id: string, patch: Partial<Detail>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  excludeIds: number[];
};

const PresentationBlock: React.FC<BlockProps> = ({
  detail,
  errors,
  onChange,
  onRemove,
  canRemove,
  excludeIds,
}) => {
  const [search, setSearch] = useState("");

  const { data: options = [], isLoading } = useFetchPresentacionOptions(search);

  const debouncedSearch = useMemo(
    () => debounce((v: string) => setSearch(v), 300),
    []
  );

  const availableOptions = options.filter(o => !excludeIds.includes(o.value));

  const optionMatch = options.find(o => o.value === detail.idPresentation);

  const selected: Option | null = detail.idPresentation
    ? { value: detail.idPresentation, label: detail.name || optionMatch?.label || '' }
    : null;

  const handleSelect = (_e: unknown, value: Option | null) => {
    onChange(detail.id!, {
      idPresentation: value?.value ?? 0,
      name: value?.label ?? '',
    });
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '5px',
        p: 2,
        mb: 1.5,
        backgroundColor: '#fafafa',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {detail.name || 'Nueva presentación'}
        </Typography>

        {canRemove && (
          <Tooltip title="Eliminar">
            <AppIconButton
              color="error"
              onClick={() => onRemove(detail.id!)}
              sx={{ ml: 'auto' }}
            >
              <DeleteIcon />
            </AppIconButton>
          </Tooltip>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: 2, minWidth: 180 }}>
          <Autocomplete
            options={availableOptions}
            loading={isLoading}
            getOptionLabel={(o: Option) => o.label}
            isOptionEqualToValue={(o: Option, v: Option) => o.value === v.value}
            value={selected}
            onChange={handleSelect}
            onInputChange={(_e, value) => debouncedSearch(value)}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Presentación"
                error={!!errors.idPresentation}
                helperText={errors.idPresentation ? 'Es un campo requerido' : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 120 }}>
          <TextField
            type="number"
            label="Precio"
            size="small"
            fullWidth
            value={detail.price || ''}
            onChange={(e) =>
              onChange(detail.id!, { price: Number(e.target.value) || 0 })
            }
            error={!!errors.price}
            helperText={errors.price ? 'Es un campo requerido' : ''}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 140 }}>
          <TextField
            type="number"
            label="Cantidad base"
            size="small"
            fullWidth
            value={detail.baseQuantity || ''}
            onChange={(e) =>
              onChange(detail.id!, { baseQuantity: Number(e.target.value) || 0 })
            }
            error={!!errors.baseQuantity}
            helperText={errors.baseQuantity ? 'Es un campo requerido' : ''}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 140 }}>
          <TextField
            label="Codigo producto"
            size="small"
            fullWidth
            value={detail.barCode}
            onChange={(e) => onChange(detail.id!, { barCode: e.target.value })}
          />
        </Box>
      </Box>
    </Box>
  );
};

type Props = {
  rows: Detail[];
  rowErrors: Record<string, RowErrors>;
  addEmptyRow: () => void;
  updateRow: (id: string, patch: Partial<Detail>) => void;
  deleteRow: (id: string) => void;
};

export const PresentationsTab: React.FC<Props> = ({
  rows,
  rowErrors,
  addEmptyRow,
  updateRow,
  deleteRow,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Presentaciones
        </Typography>

        <IconButton
          size="small"
          color="primary"
          onClick={addEmptyRow}
          aria-label="Agregar presentación"
        >
          <AddIcon />
        </IconButton>
      </Box>

      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Todavía no agregaste presentaciones. Usá el botón "+" para agregar una.
        </Typography>
      ) : (
        rows.map((detail) => (
          <PresentationBlock
            key={detail.id}
            detail={detail}
            errors={rowErrors[detail.id!] ?? {}}
            onChange={updateRow}
            onRemove={deleteRow}
            canRemove={rows.length > 1}
            excludeIds={rows
              .filter((r) => r.id !== detail.id)
              .map((r) => r.idPresentation)
              .filter((id): id is number => id > 0)}
          />
        ))
      )}
    </Box>
  );
};
