import React, { useMemo } from 'react';
import {
  Autocomplete,
  Box,
  Chip,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { AppIconButton } from '@/components';
import { useFetchColoresCatalog, useFetchTallasCatalog } from '@/hooks/useOption';
import { VariantGroupDetail, VariantGroupErrors, VariantGroupTalla } from '../../models/product.domain.type';

type GroupProps = {
  group: VariantGroupDetail;
  errors: VariantGroupErrors;
  onChange: (id: string, patch: Partial<VariantGroupDetail>) => void;
  onSetTallas: (id: string, tallas: VariantGroupTalla[]) => void;
  onRemove: (id: string) => void;
  usedColorIds: number[];
};

const VariantGroupBlock: React.FC<GroupProps> = ({
  group,
  errors,
  onChange,
  onSetTallas,
  onRemove,
  usedColorIds,
}) => {
  const { data: tallas = [] } = useFetchTallasCatalog();
  const { data: colores = [] } = useFetchColoresCatalog();

  const colorOptions = colores.filter((c) => !usedColorIds.includes(c._id) || c._id === group.idcolor);

  const selectedTallaIds = new Set((group.tallas || []).map((t) => t.idtalla));

  const tallaOptions = useMemo(() => {
    const sorted = [...tallas].sort((a, b) => {
      const ta = a.tipo || '';
      const tb = b.tipo || '';
      if (ta !== tb) return ta.localeCompare(tb);
      const oa = a.orden ?? 0;
      const ob = b.orden ?? 0;
      if (oa !== ob) return oa - ob;
      return (a.nombre || '').localeCompare(b.nombre || '');
    });
    return sorted;
  }, [tallas]);

  const handleTallasChange = (_: any, values: any[]) => {
    const prevById = new Map((group.tallas || []).map((t) => [t.idtalla, t]));
    const next: VariantGroupTalla[] = values.map((v) => {
      const prev = prevById.get(v._id);
      return {
        idtalla: v._id,
        tallaNombre: v.nombre,
        tallaTipo: v.tipo,
        sku: prev?.sku ?? '',
        idvariante: prev?.idvariante,
        estado: prev?.estado ?? 1,
      };
    });
    onSetTallas(group.id!, next);
  };

  const selectedTallaObjects = tallaOptions.filter((t) => selectedTallaIds.has(t._id));

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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {group.colorNombre || 'Color'}
        </Typography>
        {group.colorHex && (
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: group.colorHex,
              border: '1px solid #999',
            }}
          />
        )}
        <Tooltip title="Eliminar grupo">
          <AppIconButton color="error" onClick={() => onRemove(group.id!)} sx={{ ml: 'auto' }}>
            <DeleteIcon />
          </AppIconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mb: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <TextField
            select
            size="small"
            fullWidth
            label="Color (padre)"
            value={group.idcolor ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value);
              const c = colores.find((x) => x._id === val);
              onChange(group.id!, {
                idcolor: val,
                colorNombre: c?.nombre ?? null,
                colorHex: c?.hex ?? null,
              });
            }}
            error={!!errors.color}
            helperText={errors.color ? 'Seleccione un color' : ''}
          >
            <MenuItem value="">
              <em>Seleccione color</em>
            </MenuItem>
            {colorOptions.map((opt) => (
              <MenuItem key={opt._id} value={opt._id}>
                {opt.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ flex: 2, minWidth: 280 }}>
          <Autocomplete
            multiple
            size="small"
            options={tallaOptions}
            groupBy={(option) => option.tipo || 'OTROS'}
            getOptionLabel={(option) => option.nombre}
            value={selectedTallaObjects}
            onChange={handleTallasChange}
            isOptionEqualToValue={(o, v) => o._id === v._id}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  size="small"
                  label={option.nombre}
                  {...getTagProps({ index })}
                  key={option._id}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tallas (hijas)"
                error={!!errors.tallas}
                helperText={errors.tallas ? 'Seleccione al menos una talla' : 'Agrupadas por tipo (ROPA, CALZADO)'}
              />
            )}
          />
        </Box>
      </Box>

      {(group.tallas || []).length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {group.colorNombre || 'Color'}: {(group.tallas || []).map((t) => t.tallaNombre || t.idtalla).join(', ')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {(group.tallas || []).map((t) => (
              <Box key={t.idtalla} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 500 }}>
                  {t.tallaNombre || `Talla ${t.idtalla}`} {t.tallaTipo ? `(${t.tallaTipo})` : ''}
                </Typography>
                <TextField
                  size="small"
                  label="SKU"
                  value={t.sku ?? ''}
                  onChange={(e) => {
                    const next = (group.tallas || []).map((x) =>
                      x.idtalla === t.idtalla ? { ...x, sku: e.target.value } : x
                    );
                    onSetTallas(group.id!, next);
                  }}
                  sx={{ minWidth: 180 }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

type Props = {
  groups: VariantGroupDetail[];
  groupErrors: Record<string, VariantGroupErrors>;
  addGroup: () => void;
  updateGroup: (id: string, patch: Partial<VariantGroupDetail>) => void;
  setGroupTallas: (id: string, tallas: VariantGroupTalla[]) => void;
  removeGroup: (id: string) => void;
};

export const VariantsTab: React.FC<Props> = ({
  groups,
  groupErrors,
  addGroup,
  updateGroup,
  setGroupTallas,
  removeGroup,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Variantes (Color → Tallas)
        </Typography>
        <IconButton size="small" color="primary" onClick={addGroup} aria-label="Agregar color">
          <AddIcon />
        </IconButton>
      </Box>

      {groups.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Todavía no agregaste variantes. Usá "+" para agregar un color y seleccionar sus tallas.
        </Typography>
      ) : (
        groups.map((group) => (
          <VariantGroupBlock
            key={group.id}
            group={group}
            errors={groupErrors[group.id!] ?? {}}
            onChange={updateGroup}
            onSetTallas={setGroupTallas}
            onRemove={removeGroup}
            usedColorIds={groups
              .filter((g) => g.id !== group.id && g.idcolor != null)
              .map((g) => g.idcolor as number)}
          />
        ))
      )}
    </Box>
  );
};
