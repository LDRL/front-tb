import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { createRestaurantId, useRestaurantCatalog } from '../hooks';
import { ModifierGroup, ModifierGroupKind, ModifierOption, ModifierSelectionType } from '../models';

const kindOptions: { value: ModifierGroupKind; label: string }[] = [
  { value: 'selection', label: 'Selección' },
  { value: 'removal', label: 'Remover / Sin ingrediente' },
  { value: 'extra', label: 'Extra / Adicional' },
];

const selectionTypeOptions: { value: ModifierSelectionType; label: string }[] = [
  { value: 'single', label: 'Única' },
  { value: 'multiple', label: 'Múltiple' },
];

const emptyOption = (): ModifierOption => ({
  id: createRestaurantId(),
  name: '',
  priceDelta: 0,
  targetInventoryItemId: null,
  isActive: true,
});

const emptyGroup = (): ModifierGroup => ({
  id: createRestaurantId(),
  name: '',
  kind: 'selection',
  selectionType: 'single',
  required: false,
  minSelections: 0,
  maxSelections: 1,
  options: [],
  isActive: true,
});

export default function ModifierGroupsPage() {
  const { catalog, status, error, upsertModifierGroup, deleteModifierGroup } = useRestaurantCatalog();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ModifierGroup>(emptyGroup());

  const isBusy = status === 'saving' || status === 'loading';
  const groups = useMemo(() => catalog.modifierGroups, [catalog.modifierGroups]);
  const inventoryItems = catalog.inventoryItems;

  const openCreate = () => {
    setDraft(emptyGroup());
    setOpen(true);
  };

  const openEdit = (group: ModifierGroup) => {
    setDraft({ ...group, options: [...(group.options || [])] });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const updateOption = (index: number, patch: Partial<ModifierOption>) => {
    setDraft((prev) => {
      const options = [...prev.options];
      options[index] = { ...options[index], ...patch };
      return { ...prev, options };
    });
  };

  const addOption = () => setDraft((prev) => ({ ...prev, options: [...prev.options, emptyOption()] }));
  const removeOption = (index: number) =>
    setDraft((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }));

  const handleSave = async () => {
    if (!draft.name.trim()) return;
    const cleaned: ModifierGroup = {
      ...draft,
      name: draft.name.trim(),
      minSelections: Number.isFinite(Number(draft.minSelections)) ? Number(draft.minSelections) : 0,
      maxSelections: Number.isFinite(Number(draft.maxSelections)) ? Number(draft.maxSelections) : undefined,
      options: draft.options
        .filter((o) => o.name.trim())
        .map((o) => ({
          ...o,
          name: o.name.trim(),
          priceDelta: Number(o.priceDelta || 0),
          targetInventoryItemId: o.targetInventoryItemId || null,
        })),
      updatedAt: new Date().toISOString(),
      createdAt: draft.createdAt ?? new Date().toISOString(),
    };
    await upsertModifierGroup(cleaned);
    setOpen(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Modificadores (grupos y opciones)</Typography>
        <Button variant="contained" onClick={openCreate} disabled={isBusy}>Nuevo grupo</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Selección</TableCell>
            <TableCell>Min/Max</TableCell>
            <TableCell>Opciones</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{kindOptions.find((k) => k.value === group.kind)?.label ?? group.kind}</TableCell>
              <TableCell>{selectionTypeOptions.find((s) => s.value === group.selectionType)?.label ?? group.selectionType}</TableCell>
              <TableCell>{group.minSelections ?? 0} / {group.maxSelections ?? '-'}</TableCell>
              <TableCell>{group.options?.length ?? 0}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" onClick={() => openEdit(group)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => void deleteModifierGroup(group.id)}>Eliminar</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {groups.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">No hay grupos de modificadores.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={close} fullWidth maxWidth="md">
        <DialogTitle>{groups.some((g) => g.id === draft.id) ? 'Editar grupo de modificadores' : 'Nuevo grupo de modificadores'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre del grupo" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} fullWidth required />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Tipo" value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as ModifierGroupKind })} fullWidth>
                {kindOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </TextField>
              <TextField select label="Tipo de selección" value={draft.selectionType} onChange={(e) => setDraft({ ...draft, selectionType: e.target.value as ModifierSelectionType })} fullWidth>
                {selectionTypeOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </TextField>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Mín. selecciones" type="number" value={draft.minSelections ?? 0} onChange={(e) => setDraft({ ...draft, minSelections: Number(e.target.value) })} fullWidth />
              <TextField label="Máx. selecciones" type="number" value={draft.maxSelections ?? ''} onChange={(e) => setDraft({ ...draft, maxSelections: e.target.value === '' ? undefined : Number(e.target.value) })} fullWidth />
            </Stack>
            <FormControlLabel control={<Switch checked={!!draft.required} onChange={(e) => setDraft({ ...draft, required: e.target.checked })} />} label="Requerido" />
            <FormControlLabel control={<Switch checked={draft.isActive !== false} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />} label="Activo" />

            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Opciones</Typography>
              <Button startIcon={<AddIcon />} onClick={addOption}>Agregar opción</Button>
            </Stack>

            {draft.options.map((opt, idx) => (
              <Box key={opt.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField label="Nombre" value={opt.name} onChange={(e) => updateOption(idx, { name: e.target.value })} fullWidth size="small" />
                    <IconButton color="error" onClick={() => removeOption(idx)} aria-label="Eliminar opción"><DeleteIcon /></IconButton>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="Precio adicional (Q)" type="number" value={opt.priceDelta ?? 0} onChange={(e) => updateOption(idx, { priceDelta: Number(e.target.value) })} fullWidth size="small" />
                    <TextField select label="Ítem/insumo asociado (opcional)" value={opt.targetInventoryItemId ?? ''} onChange={(e) => updateOption(idx, { targetInventoryItemId: e.target.value || null })} fullWidth size="small">
                      <MenuItem value="">(Ninguno)</MenuItem>
                      {inventoryItems.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Stack>
              </Box>
            ))}
            {draft.options.length === 0 && (
              <Typography variant="body2" color="text.secondary">Agregá opciones al grupo (ej. bebidas, salsas, "sin cebolla", extras).</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancelar</Button>
          <Button variant="contained" onClick={() => void handleSave()} disabled={isBusy || !draft.name.trim()}>
            Guardar grupo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
