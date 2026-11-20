import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import { InventoryItem, ModifierGroup, ModifierOption, Recipe } from '../models';

type PreviewOption = ModifierOption & { _rowId?: string };

type PreviewGroup = Pick<ModifierGroup, 'name' | 'minSelections' | 'allowRepeat'> & {
  maxSelections?: number | string | null;
  options?: PreviewOption[];
};

const getSourceName = (opt: PreviewOption, recipes: Recipe[], inventoryItems: InventoryItem[]) => {
  const sourceType = opt.sourceType || (opt.targetRecipeId ? 'recipe' : 'product');
  const sourceId = opt.sourceId ?? opt.targetRecipeId ?? opt.targetInventoryItemId ?? null;
  if (!sourceId) return opt.name ?? '';
  if (sourceType === 'recipe') return recipes.find((r) => r.id === sourceId)?.name ?? opt.name ?? '';
  return inventoryItems.find((p) => p.id === sourceId)?.name ?? opt.name ?? '';
};

const getRecipeId = (opt: PreviewOption): string | null => {
  if (opt.sourceType === 'recipe') return opt.sourceId ?? null;
  return opt.targetRecipeId ?? null;
};

type Props = {
  group: PreviewGroup;
  recipes: Recipe[];
  inventoryItems: InventoryItem[];
  sticky?: boolean;
  showHeader?: boolean;
};

export default function ModifierGroupPreview({ group, recipes, inventoryItems, sticky = true, showHeader = true }: Props) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [removedByOption, setRemovedByOption] = useState<Record<string, string[]>>({});

  const min = Number.isFinite(Number(group.minSelections)) ? Number(group.minSelections) : 0;
  const maxRaw = group.maxSelections;
  const max = maxRaw === undefined || maxRaw === null || (maxRaw as unknown) === '' ? undefined : Number(maxRaw);
  const allowRepeat = !!group.allowRepeat;
  const options = (group.options || [])
    .map((o) => ({
      ...o,
      resolvedName: getSourceName(o, recipes, inventoryItems) || o.name || 'Opción',
    }))
    .filter((o) => !!(o.sourceId ?? o.targetRecipeId ?? o.targetInventoryItemId));

  useEffect(() => {
    setSelected({});
    setRemovedByOption({});
  }, [group.allowRepeat, group.minSelections, group.maxSelections, group.options?.length, group.name]);

  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0);
  const canAddMore = max === undefined ? true : totalSelected < max;

  const toggleOption = (id: string) => {
    setSelected((prev) => {
      const current = prev[id] || 0;
      const next = { ...prev };
      if (allowRepeat) {
        if (current > 0) delete next[id];
        else if (canAddMore) next[id] = 1;
      } else if (current > 0) {
        delete next[id];
      } else if (canAddMore) {
        if (max === 1) return { [id]: 1 };
        next[id] = 1;
      } else {
        return prev;
      }
      return next;
    });
    setRemovedByOption((prev) => {
      const current = selected[id] || 0;
      const willBeSelected = current > 0 ? false : canAddMore;
      if (!willBeSelected || (max === 1 && current === 0)) {
        if (max === 1 && current === 0) {
          return {};
        }
        if (current > 0) {
          const next = { ...prev };
          delete next[id];
          return next;
        }
      }
      return prev;
    });
  };

  const changeQty = (id: string, delta: number) => {
    setSelected((prev) => {
      const current = prev[id] || 0;
      let nextQty = current + delta;
      if (nextQty < 0) nextQty = 0;
      const others = Object.entries(prev).reduce((acc, [k, v]) => acc + (k === id ? 0 : v), 0);
      if (max !== undefined && others + nextQty > max) nextQty = Math.max(0, max - others);
      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[id];
        setRemovedByOption((rPrev) => {
          const rNext = { ...rPrev };
          delete rNext[id];
          return rNext;
        });
      } else {
        next[id] = nextQty;
      }
      return next;
    });
  };

  const toggleRemovedComponent = (optionId: string, inventoryItemId: string) => {
    setRemovedByOption((prev) => {
      const current = prev[optionId] || [];
      const exists = current.includes(inventoryItemId);
      const nextList = exists ? current.filter((id) => id !== inventoryItemId) : [...current, inventoryItemId];
      const next = { ...prev };
      if (nextList.length === 0) delete next[optionId];
      else next[optionId] = nextList;
      return next;
    });
  };

  const requirementText =
    min > 0
      ? `Obligatorio: elegí al menos ${min}${max !== undefined ? ` (máx. ${max})` : ''}`
      : `Opcional${max !== undefined ? ` (máx. ${max})` : ''}`;

  return (
    <Card variant="outlined" sx={sticky ? { position: 'sticky', top: 8 } : undefined}>
      <CardContent>
        {showHeader && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Vista previa
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              Así se verá la personalización al configurar un pedido.
            </Typography>
          </>
        )}

        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {group.name || 'Nombre de personalización'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          {requirementText}
          {allowRepeat ? ' · Podés repetir opciones' : ''}
        </Typography>

        {options.length === 0 ? (
          <Alert severity="info">Agregá opciones para ver la vista previa.</Alert>
        ) : (
          <Stack spacing={1}>
            {options.map((opt) => {
              const qty = selected[opt.id] || 0;
              const checked = qty > 0;
              const disabledAdd = !checked && !canAddMore;
              const recipeId = getRecipeId(opt);
              const recipe = recipeId ? recipes.find((r) => r.id === recipeId) : undefined;
              const removableComponents = checked
                ? (recipe?.components || []).filter((c) => c.optional && c.inventoryItemId)
                : [];
              const removedIds = removedByOption[opt.id] || [];
              return (
                <Box key={opt._rowId || opt.id} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <FormControlLabel
                      sx={{ mr: 0, flex: 1 }}
                      control={<Checkbox checked={checked} disabled={disabledAdd} onChange={() => toggleOption(opt.id)} />}
                      label={`${opt.resolvedName}${Number(opt.priceDelta) ? ` (+Q ${Number(opt.priceDelta).toFixed(2)})` : ''}`}
                    />
                    {allowRepeat && checked && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Button size="small" variant="outlined" onClick={() => changeQty(opt.id, -1)} sx={{ minWidth: 32, px: 0 }}>
                          -
                        </Button>
                        <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                          {qty}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => changeQty(opt.id, 1)}
                          disabled={!canAddMore}
                          sx={{ minWidth: 32, px: 0 }}
                        >
                          +
                        </Button>
                      </Stack>
                    )}
                  </Box>

                  {removableComponents.length > 0 && (
                    <Box sx={{ pl: 4, pr: 1, pb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                        Podés quitar:
                      </Typography>
                      <Stack spacing={0}>
                        {removableComponents.map((component) => {
                          const ingredientName = inventoryItems.find((i) => i.id === component.inventoryItemId)?.name || component.inventoryItemId;
                          const isRemoved = removedIds.includes(component.inventoryItemId);
                          return (
                            <FormControlLabel
                              key={`${opt.id}-${component.inventoryItemId}`}
                              sx={{ ml: 0 }}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={isRemoved}
                                  onChange={() => toggleRemovedComponent(opt.id, component.inventoryItemId)}
                                />
                              }
                              label={`Sin ${ingredientName}`}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}

        <Divider sx={{ my: 1.5 }} />
        <Typography variant="caption" color="text.secondary">
          Seleccionadas: {totalSelected}
          {max !== undefined ? ` / ${max}` : ''}
        </Typography>
      </CardContent>
    </Card>
  );
}
