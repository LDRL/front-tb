import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import {
  ComboSlot,
  ComboTemplate,
  ConfiguredCombo,
  ConfiguredComboSlotSelection,
  ModifierGroup,
  ModifierOption,
  RestaurantCatalog,
  SelectedModifierOption,
} from '../models';
import {
  ConsumptionMap,
  computeConfiguredComboConsumption,
  formatAvailabilityIssues,
  getAvailabilityIssues,
  mergeConsumptions,
} from '../utils/availability';

interface Props {
  open: boolean;
  combo: ComboTemplate | null;
  modifierGroups: ModifierGroup[];
  catalog: RestaurantCatalog;
  baseConsumption?: ConsumptionMap;
  onClose: () => void;
  onConfirm: (configured: ConfiguredCombo) => void;
}

type SelectionMap = Record<string, string[]>; // slotId -> optionIds
type ModifierMap = Record<string, string[]>; // scopeKey -> modifierOptionIds

const scopeKey = (parts: string[]) => parts.join('::');

const getResolvedGroups = (
  ids: string[] | undefined,
  inline: ModifierGroup[] | undefined,
  catalogGroups: ModifierGroup[]
): ModifierGroup[] => {
  const fromIds = (ids || [])
    .map((id) => catalogGroups.find((g) => g.id === id))
    .filter((g): g is ModifierGroup => !!g);
  const inlineGroups = inline || [];
  const merged = [...fromIds, ...inlineGroups];
  const seen = new Set<string>();
  return merged.filter((g) => (seen.has(g.id) ? false : (seen.add(g.id), true)));
};

const isSingleChoice = (min: number, max: number) => min <= 1 && max <= 1;

export default function ComboConfiguratorDialog({ open, combo, modifierGroups, catalog, baseConsumption = {}, onClose, onConfirm }: Props) {
  const [slotSelections, setSlotSelections] = useState<SelectionMap>({});
  const [modifierSelections, setModifierSelections] = useState<ModifierMap>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!combo || !open) return;
    const initialSlots: SelectionMap = {};
    combo.slots.forEach((slot) => {
      initialSlots[slot.id] = [];
    });
    setSlotSelections(initialSlots);
    setModifierSelections({});
    setError(null);
  }, [combo, open]);

  const comboModifierGroups = useMemo(
    () => (combo ? getResolvedGroups(combo.modifierGroupIds, combo.inlineModifierGroups, modifierGroups) : []),
    [combo, modifierGroups]
  );

  const slotSelectionCountsValid = (slot: ComboSlot, selectedIds: string[]) => {
    const min = slot.minSelections ?? (slot.required === false ? 0 : 1);
    const max = slot.maxSelections ?? Math.max(1, min);
    return selectedIds.length >= min && selectedIds.length <= max;
  };

  const getGroupBounds = (group: ModifierGroup) => {
    const min = group.minSelections ?? (group.required ? 1 : 0);
    const max = group.maxSelections ?? (group.selectionType === 'single' ? 1 : Math.max(1, min || 1, group.options.length || 1));
    return { min, max };
  };

  const modifierGroupValid = (group: ModifierGroup, selectedIds: string[]) => {
    const { min, max } = getGroupBounds(group);
    return selectedIds.length >= min && selectedIds.length <= max;
  };

  const setSlotOptionSelection = (slot: ComboSlot, optionId: string, checked: boolean) => {
    const min = slot.minSelections ?? (slot.required === false ? 0 : 1);
    const max = slot.maxSelections ?? Math.max(1, min);
    setSlotSelections((prev) => {
      const current = prev[slot.id] || [];
      let next = current;
      if (isSingleChoice(min, max)) {
        next = checked ? [optionId] : [];
      } else {
        if (checked) {
          if (current.includes(optionId)) next = current;
          else if (current.length >= max) next = current; // ignore extra
          else next = [...current, optionId];
        } else {
          next = current.filter((id) => id !== optionId);
        }
      }
      return { ...prev, [slot.id]: next };
    });
  };

  const setModifierOptionSelection = (key: string, group: ModifierGroup, optionId: string, checked: boolean) => {
    const { max } = getGroupBounds(group);
    setModifierSelections((prev) => {
      const current = prev[key] || [];
      let next = current;
      if (group.selectionType === 'single' || max <= 1) {
        next = checked ? [optionId] : [];
      } else {
        if (checked) {
          if (current.includes(optionId)) next = current;
          else if (current.length >= max) next = current;
          else next = [...current, optionId];
        } else {
          next = current.filter((id) => id !== optionId);
        }
      }
      return { ...prev, [key]: next };
    });
  };

  const buildSelectedModifiers = (key: string, group: ModifierGroup): SelectedModifierOption[] => {
    const selectedIds = modifierSelections[key] || [];
    return selectedIds
      .map((id) => group.options.find((o) => o.id === id))
      .filter((o): o is ModifierOption => !!o)
      .map((o) => ({ groupId: group.id, optionId: o.id, optionName: o.name, quantity: 1, priceDelta: Number(o.priceDelta || 0) }));
  };

  const calcTotal = useMemo(() => {
    if (!combo) return 0;
    let total = Number(combo.basePrice || 0);

    combo.slots.forEach((slot) => {
      const selectedOptionIds = slotSelections[slot.id] || [];
      selectedOptionIds.forEach((optId) => {
        const opt = slot.options.find((o) => o.id === optId);
        if (!opt) return;
        total += Number(opt.priceDelta || 0);
        const slotGroups = getResolvedGroups(slot.modifierGroupIds, slot.inlineModifierGroups, modifierGroups);
        const optionGroups = getResolvedGroups(opt.modifierGroupIds, opt.inlineModifierGroups, modifierGroups);
        slotGroups.forEach((group) => {
          buildSelectedModifiers(scopeKey(['slot', slot.id, group.id]), group).forEach((m) => (total += Number(m.priceDelta || 0)));
        });
        optionGroups.forEach((group) => {
          buildSelectedModifiers(scopeKey(['slot', slot.id, 'opt', opt.id, group.id]), group).forEach((m) => (total += Number(m.priceDelta || 0)));
        });
      });
    });

    comboModifierGroups.forEach((group) => {
      buildSelectedModifiers(scopeKey(['combo', combo.id, group.id]), group).forEach((m) => (total += Number(m.priceDelta || 0)));
    });

    return Number(total.toFixed(2));
  }, [combo, slotSelections, modifierSelections, modifierGroups, comboModifierGroups]);

  const buildConfiguredFromState = useMemo<ConfiguredCombo | null>(() => {
    if (!combo) return null;

    const selections: ConfiguredComboSlotSelection[] = [];
    combo.slots.forEach((slot) => {
      const selectedOptionIds = slotSelections[slot.id] || [];
      selectedOptionIds.forEach((optId) => {
        const opt = slot.options.find((o) => o.id === optId);
        if (!opt) return;
        const slotGroups = getResolvedGroups(slot.modifierGroupIds, slot.inlineModifierGroups, modifierGroups);
        const optionGroups = getResolvedGroups(opt.modifierGroupIds, opt.inlineModifierGroups, modifierGroups);
        const mods: SelectedModifierOption[] = [];
        slotGroups.forEach((group) => mods.push(...buildSelectedModifiers(scopeKey(['slot', slot.id, group.id]), group)));
        optionGroups.forEach((group) => mods.push(...buildSelectedModifiers(scopeKey(['slot', slot.id, 'opt', opt.id, group.id]), group)));
        selections.push({
          slotId: slot.id,
          slotName: slot.name,
          optionId: opt.id,
          optionName: opt.name,
          quantity: 1,
          priceDelta: Number(opt.priceDelta || 0),
          modifiers: mods,
        });
      });
    });

    const comboMods: SelectedModifierOption[] = [];
    comboModifierGroups.forEach((group) => {
      comboMods.push(...buildSelectedModifiers(scopeKey(['combo', combo.id, group.id]), group));
    });

    return {
      comboId: combo.id,
      comboName: combo.name,
      basePrice: Number(combo.basePrice || 0),
      totalPrice: calcTotal,
      selections,
      modifiers: comboMods.length ? comboMods : undefined,
    };
  }, [combo, slotSelections, modifierSelections, modifierGroups, comboModifierGroups, calcTotal]);

  const currentConsumption = useMemo(
    () => (buildConfiguredFromState ? computeConfiguredComboConsumption(catalog, combo || undefined, buildConfiguredFromState, 1) : {}),
    [buildConfiguredFromState, catalog, combo]
  );

  const availabilityIssues = useMemo(
    () => getAvailabilityIssues(catalog, mergeConsumptions(baseConsumption, currentConsumption)),
    [catalog, baseConsumption, currentConsumption]
  );

  const validate = (): string | null => {
    if (!combo) return 'No hay combo seleccionado.';

    for (const slot of combo.slots) {
      const selected = slotSelections[slot.id] || [];
      if (!slotSelectionCountsValid(slot, selected)) {
        const min = slot.minSelections ?? (slot.required === false ? 0 : 1);
        const max = slot.maxSelections ?? Math.max(1, min);
        return `Revisá el slot "${slot.name || 'Slot'}": seleccioná entre ${min} y ${max} opción(es).`;
      }

      for (const optId of selected) {
        const opt = slot.options.find((o) => o.id === optId);
        if (!opt) continue;
        const slotGroups = getResolvedGroups(slot.modifierGroupIds, slot.inlineModifierGroups, modifierGroups);
        const optionGroups = getResolvedGroups(opt.modifierGroupIds, opt.inlineModifierGroups, modifierGroups);
        for (const group of [...slotGroups, ...optionGroups]) {
          const key = slotGroups.includes(group)
            ? scopeKey(['slot', slot.id, group.id])
            : scopeKey(['slot', slot.id, 'opt', opt.id, group.id]);
          const mods = modifierSelections[key] || [];
          if (!modifierGroupValid(group, mods)) {
            const { min, max } = getGroupBounds(group);
            return `Revisá "${group.name}" en "${slot.name}": seleccioná entre ${min} y ${max} opción(es).`;
          }
        }
      }
    }

    for (const group of comboModifierGroups) {
      const mods = modifierSelections[scopeKey(['combo', combo.id, group.id])] || [];
      if (!modifierGroupValid(group, mods)) {
        const { min, max } = getGroupBounds(group);
        return `Revisá "${group.name}" del combo: seleccioná entre ${min} y ${max} opción(es).`;
      }
    }

    return null;
  };

  const handleConfirm = () => {
    if (!combo || !buildConfiguredFromState) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (availabilityIssues.length > 0) {
      setError(`Stock insuficiente (preventivo): ${formatAvailabilityIssues(availabilityIssues)}`);
      return;
    }

    setError(null);
    onConfirm(buildConfiguredFromState);
  };

  const renderModifierGroup = (key: string, group: ModifierGroup) => {
    const selected = modifierSelections[key] || [];
    const { min, max } = getGroupBounds(group);
    const single = group.selectionType === 'single' || max <= 1;

    return (
      <Box key={group.id} sx={{ mt: 1, pl: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{group.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {single ? 'Elegí 1 opción' : `Elegí entre ${min} y ${max} opción(es)`}
          {Number(group.maxSelections) ? ` (máx. ${group.maxSelections})` : ''}
        </Typography>
        {single ? (
          <RadioGroup
            value={selected[0] || ''}
            onChange={(e) => setModifierOptionSelection(key, group, e.target.value, true)}
          >
            {group.options.map((opt) => (
              <FormControlLabel
                key={opt.id}
                value={opt.id}
                control={<Radio size="small" />}
                label={`${opt.name}${Number(opt.priceDelta) ? ` (+Q ${Number(opt.priceDelta).toFixed(2)})` : ''}`}
              />
            ))}
          </RadioGroup>
        ) : (
          <Stack>
            {group.options.map((opt) => {
              const checked = selected.includes(opt.id);
              const disabled = !checked && selected.length >= max;
              return (
                <FormControlLabel
                  key={opt.id}
                  control={<Checkbox size="small" checked={checked} disabled={disabled} onChange={(e) => setModifierOptionSelection(key, group, opt.id, e.target.checked)} />}
                  label={`${opt.name}${Number(opt.priceDelta) ? ` (+Q ${Number(opt.priceDelta).toFixed(2)})` : ''}`}
                />
              );
            })}
          </Stack>
        )}
      </Box>
    );
  };

  if (!combo) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Configurar combo: {combo.name}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {availabilityIssues.length > 0 && (
            <Alert severity="warning">
              Disponibilidad insuficiente para la selección actual (preventivo): {formatAvailabilityIssues(availabilityIssues)}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary">
            Seleccioná las opciones de cada componente y personalizá según corresponda.
          </Typography>

          {combo.slots.map((slot, index) => {
            const selected = slotSelections[slot.id] || [];
            const min = slot.minSelections ?? (slot.required === false ? 0 : 1);
            const max = slot.maxSelections ?? Math.max(1, min);
            const single = isSingleChoice(min, max);
            const slotGroups = getResolvedGroups(slot.modifierGroupIds, slot.inlineModifierGroups, modifierGroups);

            return (
              <Box key={slot.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle1">{index + 1}. {slot.name || 'Slot'}</Typography>
                {slot.description && <Typography variant="body2" color="text.secondary">{slot.description}</Typography>}
                <Typography variant="caption" color="text.secondary">
                  {single ? 'Elegí 1 opción' : `Elegí entre ${min} y ${max} opción(es)`}
                </Typography>

                {single ? (
                  <RadioGroup
                    value={selected[0] || ''}
                    onChange={(e) => setSlotOptionSelection(slot, e.target.value, true)}
                  >
                    {slot.options.map((opt) => (
                      <FormControlLabel
                        key={opt.id}
                        value={opt.id}
                        control={<Radio />}
                        label={`${opt.name}${Number(opt.priceDelta) ? ` (+Q ${Number(opt.priceDelta).toFixed(2)})` : ''}`}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <Stack>
                    {slot.options.map((opt) => {
                      const checked = selected.includes(opt.id);
                      const disabled = !checked && selected.length >= max;
                      return (
                        <FormControlLabel
                          key={opt.id}
                          control={<Checkbox checked={checked} disabled={disabled} onChange={(e) => setSlotOptionSelection(slot, opt.id, e.target.checked)} />}
                          label={`${opt.name}${Number(opt.priceDelta) ? ` (+Q ${Number(opt.priceDelta).toFixed(2)})` : ''}`}
                        />
                      );
                    })}
                  </Stack>
                )}

                {selected.map((optId) => {
                  const opt = slot.options.find((o) => o.id === optId);
                  if (!opt) return null;
                  const optionGroups = getResolvedGroups(opt.modifierGroupIds, opt.inlineModifierGroups, modifierGroups);
                  const groups = [...slotGroups, ...optionGroups];
                  if (groups.length === 0) return null;
                  return (
                    <Box key={`${slot.id}-${opt.id}-mods`} sx={{ mt: 1 }}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">Personalización: {opt.name}</Typography>
                      {groups.map((group) => renderModifierGroup(
                        slotGroups.includes(group)
                          ? scopeKey(['slot', slot.id, group.id])
                          : scopeKey(['slot', slot.id, 'opt', opt.id, group.id]),
                        group
                      ))}
                    </Box>
                  );
                })}
              </Box>
            );
          })}

          {comboModifierGroups.length > 0 && (
            <Box sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1">Extras / adicionales del combo</Typography>
              {comboModifierGroups.map((group) => renderModifierGroup(scopeKey(['combo', combo.id, group.id]), group))}
            </Box>
          )}

          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Total</Typography>
            <Typography variant="h6">Q {calcTotal.toFixed(2)}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleConfirm} disabled={availabilityIssues.length > 0}>Agregar al pedido</Button>
      </DialogActions>
    </Dialog>
  );
}
