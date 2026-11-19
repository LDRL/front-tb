import { useMemo, useState } from 'react';
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  ListItemText,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { createRestaurantId, useRestaurantCatalog } from '../hooks';
import { ComboPricingMode, ComboSlot, ComboSlotOption, ComboTemplate } from '../models';

const pricingModeOptions: { value: ComboPricingMode; label: string }[] = [
  { value: 'fixed', label: 'Precio fijo' },
  { value: 'base_plus_options', label: 'Base + opciones/extras' },
  { value: 'sum', label: 'Suma de componentes' },
];

const emptySlotOption = (): ComboSlotOption => ({
  id: createRestaurantId(),
  name: '',
  itemId: null,
  recipeId: null,
  priceDelta: 0,
  modifierGroupIds: [],
  isActive: true,
});

const emptySlot = (): ComboSlot => ({
  id: createRestaurantId(),
  name: '',
  description: '',
  quantity: 1,
  required: true,
  minSelections: 1,
  maxSelections: 1,
  options: [emptySlotOption()],
  modifierGroupIds: [],
  isActive: true,
});

const emptyCombo = (): ComboTemplate => ({
  id: createRestaurantId(),
  name: '',
  description: '',
  basePrice: 0,
  pricingMode: 'fixed',
  slots: [emptySlot()],
  modifierGroupIds: [],
  isActive: true,
});

export default function CombosPage() {
  const { catalog, status, error, upsertCombo, deleteCombo } = useRestaurantCatalog();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ComboTemplate>(emptyCombo());

  const isBusy = status === 'saving' || status === 'loading';
  const combos = useMemo(() => catalog.combos, [catalog.combos]);
  const inventoryItems = catalog.inventoryItems;
  const recipes = catalog.recipes;
  const modifierGroups = catalog.modifierGroups;

  const openCreate = () => {
    setDraft(emptyCombo());
    setOpen(true);
  };

  const openEdit = (combo: ComboTemplate) => {
    setDraft(JSON.parse(JSON.stringify(combo)) as ComboTemplate);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const updateSlot = (slotIndex: number, patch: Partial<ComboSlot>) => {
    setDraft((prev) => {
      const slots = [...prev.slots];
      slots[slotIndex] = { ...slots[slotIndex], ...patch };
      return { ...prev, slots };
    });
  };

  const addSlot = () => setDraft((prev) => ({ ...prev, slots: [...prev.slots, emptySlot()] }));
  const removeSlot = (slotIndex: number) =>
    setDraft((prev) => ({ ...prev, slots: prev.slots.filter((_, i) => i !== slotIndex) }));

  const addSlotOption = (slotIndex: number) => {
    setDraft((prev) => {
      const slots = [...prev.slots];
      slots[slotIndex] = { ...slots[slotIndex], options: [...slots[slotIndex].options, emptySlotOption()] };
      return { ...prev, slots };
    });
  };

  const removeSlotOption = (slotIndex: number, optionIndex: number) => {
    setDraft((prev) => {
      const slots = [...prev.slots];
      slots[slotIndex] = {
        ...slots[slotIndex],
        options: slots[slotIndex].options.filter((_, i) => i !== optionIndex),
      };
      return { ...prev, slots };
    });
  };

  const updateSlotOption = (slotIndex: number, optionIndex: number, patch: Partial<ComboSlotOption>) => {
    setDraft((prev) => {
      const slots = [...prev.slots];
      const options = [...slots[slotIndex].options];
      options[optionIndex] = { ...options[optionIndex], ...patch };
      slots[slotIndex] = { ...slots[slotIndex], options };
      return { ...prev, slots };
    });
  };

  const toggleSlotModifierGroup = (slotIndex: number, groupId: string) => {
    setDraft((prev) => {
      const slots = [...prev.slots];
      const current = slots[slotIndex].modifierGroupIds || [];
      const next = current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId];
      slots[slotIndex] = { ...slots[slotIndex], modifierGroupIds: next };
      return { ...prev, slots };
    });
  };

  const toggleOptionModifierGroup = (slotIndex: number, optionIndex: number, groupId: string) => {
    setDraft((prev) => {
      const slots = [...prev.slots];
      const options = [...slots[slotIndex].options];
      const current = options[optionIndex].modifierGroupIds || [];
      const next = current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId];
      options[optionIndex] = { ...options[optionIndex], modifierGroupIds: next };
      slots[slotIndex] = { ...slots[slotIndex], options };
      return { ...prev, slots };
    });
  };

  const toggleComboModifierGroup = (groupId: string) => {
    setDraft((prev) => {
      const current = prev.modifierGroupIds || [];
      const next = current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId];
      return { ...prev, modifierGroupIds: next };
    });
  };

  const handleSave = async () => {
    if (!draft.name.trim()) return;

    const cleaned: ComboTemplate = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description?.trim() || '',
      basePrice: Number(draft.basePrice || 0),
      modifierGroupIds: draft.modifierGroupIds || [],
      slots: draft.slots
        .filter((s) => s.name.trim())
        .map((s) => ({
          ...s,
          name: s.name.trim(),
          description: s.description?.trim() || '',
          quantity: Math.max(1, Number(s.quantity || 1)),
          minSelections: Math.max(0, Number(s.minSelections ?? 0)),
          maxSelections: Math.max(1, Number(s.maxSelections ?? 1)),
          modifierGroupIds: s.modifierGroupIds || [],
          options: s.options
            .filter((o) => o.name.trim())
            .map((o) => ({
              ...o,
              name: o.name.trim(),
              itemId: o.itemId || null,
              recipeId: o.recipeId || null,
              priceDelta: Number(o.priceDelta || 0),
              modifierGroupIds: o.modifierGroupIds || [],
            })),
        })),
      updatedAt: new Date().toISOString(),
      createdAt: draft.createdAt ?? new Date().toISOString(),
    };

    await upsertCombo(cleaned);
    setOpen(false);
  };

  const slotSummary = (slot: ComboSlot) => `${slot.options.length} opción(es), sel. ${slot.minSelections ?? 0}-${slot.maxSelections ?? '-'}`;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Combos</Typography>
        <Button variant="contained" onClick={openCreate} disabled={isBusy}>Nuevo combo</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Precio base</TableCell>
            <TableCell>Modo precio</TableCell>
            <TableCell>Slots</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combos.map((combo) => (
            <TableRow key={combo.id}>
              <TableCell>{combo.name}</TableCell>
              <TableCell>Q {Number(combo.basePrice || 0).toFixed(2)}</TableCell>
              <TableCell>{pricingModeOptions.find((p) => p.value === combo.pricingMode)?.label ?? combo.pricingMode ?? 'Fijo'}</TableCell>
              <TableCell>{combo.slots?.length ?? 0}</TableCell>
              <TableCell>{combo.isActive === false ? 'No' : 'Sí'}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" onClick={() => openEdit(combo)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => void deleteCombo(combo.id)}>Eliminar</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {combos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">No hay combos registrados.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={close} fullWidth maxWidth="lg">
        <DialogTitle>{combos.some((c) => c.id === draft.id) ? 'Editar combo' : 'Nuevo combo'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Nombre del combo" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} fullWidth required />
              <TextField label="Precio base (Q)" type="number" value={draft.basePrice} onChange={(e) => setDraft({ ...draft, basePrice: Number(e.target.value) })} sx={{ minWidth: 220 }} />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField select label="Modo de precio" value={draft.pricingMode || 'fixed'} onChange={(e) => setDraft({ ...draft, pricingMode: e.target.value as ComboPricingMode })} fullWidth>
                {pricingModeOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </TextField>
              <FormControlLabel control={<Checkbox checked={draft.isActive !== false} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />} label="Activo" sx={{ minWidth: 160 }} />
            </Stack>
            <TextField label="Descripción" value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} fullWidth multiline minRows={2} />

            <Divider />
            <Typography variant="subtitle1">Modificadores / extras a nivel combo</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {modifierGroups.map((group) => (
                <FormControlLabel
                  key={group.id}
                  control={<Checkbox checked={(draft.modifierGroupIds || []).includes(group.id)} onChange={() => toggleComboModifierGroup(group.id)} />}
                  label={group.name}
                />
              ))}
              {modifierGroups.length === 0 && <Typography variant="body2" color="text.secondary">No hay grupos de modificadores creados (podés agregarlos en la pestaña Modificadores).</Typography>}
            </Stack>

            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Slots / componentes del combo</Typography>
              <Button startIcon={<AddIcon />} onClick={addSlot}>Agregar slot</Button>
            </Stack>

            {draft.slots.map((slot, slotIndex) => (
              <Accordion key={slot.id} defaultExpanded={slotIndex === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', pr: 1 }}>
                    <Typography>{slot.name || `Slot ${slotIndex + 1}`} — {slotSummary(slot)}</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <TextField label="Nombre del slot" value={slot.name} onChange={(e) => updateSlot(slotIndex, { name: e.target.value })} fullWidth />
                      <TextField label="Cantidad" type="number" value={slot.quantity} onChange={(e) => updateSlot(slotIndex, { quantity: Number(e.target.value) })} sx={{ minWidth: 140 }} />
                      <IconButton color="error" onClick={() => removeSlot(slotIndex)} aria-label="Eliminar slot"><DeleteIcon /></IconButton>
                    </Stack>
                    <TextField label="Descripción" value={slot.description || ''} onChange={(e) => updateSlot(slotIndex, { description: e.target.value })} fullWidth />
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <TextField label="Mín. selecciones" type="number" value={slot.minSelections ?? 0} onChange={(e) => updateSlot(slotIndex, { minSelections: Number(e.target.value) })} fullWidth />
                      <TextField label="Máx. selecciones" type="number" value={slot.maxSelections ?? 1} onChange={(e) => updateSlot(slotIndex, { maxSelections: Number(e.target.value) })} fullWidth />
                      <FormControlLabel control={<Checkbox checked={slot.required !== false} onChange={(e) => updateSlot(slotIndex, { required: e.target.checked })} />} label="Requerido" />
                    </Stack>

                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Grupos de modificadores del slot (ej. personalización del sándwich)</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {modifierGroups.map((group) => (
                        <FormControlLabel
                          key={group.id}
                          control={<Checkbox checked={(slot.modifierGroupIds || []).includes(group.id)} onChange={() => toggleSlotModifierGroup(slotIndex, group.id)} />}
                          label={<ListItemText primary={group.name} secondary={group.kind} />}
                        />
                      ))}
                      {modifierGroups.length === 0 && <Typography variant="body2" color="text.secondary">Sin grupos disponibles.</Typography>}
                    </Stack>

                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Opciones del slot</Typography>
                      <Button size="small" startIcon={<AddIcon />} onClick={() => addSlotOption(slotIndex)}>Agregar opción</Button>
                    </Stack>

                    {slot.options.map((option, optionIndex) => (
                      <Box key={option.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <TextField label="Nombre opción" value={option.name} onChange={(e) => updateSlotOption(slotIndex, optionIndex, { name: e.target.value })} fullWidth size="small" />
                            <IconButton color="error" onClick={() => removeSlotOption(slotIndex, optionIndex)} aria-label="Eliminar opción"><DeleteIcon /></IconButton>
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField select label="Ítem/insumo (opcional)" value={option.itemId ?? ''} onChange={(e) => updateSlotOption(slotIndex, optionIndex, { itemId: e.target.value || null })} fullWidth size="small">
                              <MenuItem value="">(Ninguno)</MenuItem>
                              {inventoryItems.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                            </TextField>
                            <TextField select label="Receta (opcional)" value={option.recipeId ?? ''} onChange={(e) => updateSlotOption(slotIndex, optionIndex, { recipeId: e.target.value || null })} fullWidth size="small">
                              <MenuItem value="">(Ninguna)</MenuItem>
                              {recipes.map((recipe) => <MenuItem key={recipe.id} value={recipe.id}>{recipe.name}</MenuItem>)}
                            </TextField>
                            <TextField label="Precio adicional (Q)" type="number" value={option.priceDelta ?? 0} onChange={(e) => updateSlotOption(slotIndex, optionIndex, { priceDelta: Number(e.target.value) })} sx={{ minWidth: 180 }} size="small" />
                          </Stack>
                          <Typography variant="body2">Modificadores de la opción</Typography>
                          <Stack direction="row" flexWrap="wrap" gap={1}>
                            {modifierGroups.map((group) => (
                              <FormControlLabel
                                key={group.id}
                                control={<Checkbox checked={(option.modifierGroupIds || []).includes(group.id)} onChange={() => toggleOptionModifierGroup(slotIndex, optionIndex, group.id)} />}
                                label={group.name}
                              />
                            ))}
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancelar</Button>
          <Button variant="contained" onClick={() => void handleSave()} disabled={isBusy || !draft.name.trim()}>
            Guardar combo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
