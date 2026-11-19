import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { createRestaurantId, useRestaurantCatalog } from '../hooks';
import { InventoryItem, InventoryItemKind, RestaurantUnit } from '../models';

const kindOptions: { value: InventoryItemKind; label: string }[] = [
  { value: 'product', label: 'Producto' },
  { value: 'ingredient', label: 'Insumo' },
  { value: 'prepared', label: 'Preparado' },
];

const unitOptions: { value: RestaurantUnit; label: string }[] = [
  { value: 'unit', label: 'Unidad' },
  { value: 'piece', label: 'Pieza' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'portion', label: 'Porción' },
];

const emptyItem = (): InventoryItem => ({
  id: createRestaurantId(),
  name: '',
  kind: 'ingredient',
  unit: 'unit',
  stock: null,
  minStock: null,
  trackInventory: true,
  isActive: true,
});

export default function InventoryItemsPage() {
  const { catalog, status, error, upsertInventoryItem, deleteInventoryItem } = useRestaurantCatalog();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<InventoryItem>(emptyItem());

  const isBusy = status === 'saving' || status === 'loading';
  const items = useMemo(() => catalog.inventoryItems, [catalog.inventoryItems]);

  const openCreate = () => {
    setDraft(emptyItem());
    setOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setDraft({ ...item });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const handleSave = async () => {
    if (!draft.name.trim()) return;
    await upsertInventoryItem({
      ...draft,
      name: draft.name.trim(),
      stock: draft.stock === null || draft.stock === undefined || Number.isNaN(Number(draft.stock)) ? null : Number(draft.stock),
      minStock:
        draft.minStock === null || draft.minStock === undefined || Number.isNaN(Number(draft.minStock))
          ? null
          : Number(draft.minStock),
      updatedAt: new Date().toISOString(),
      createdAt: draft.createdAt ?? new Date().toISOString(),
    });
    setOpen(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Insumos / Ítems</Typography>
        <Button variant="contained" onClick={openCreate} disabled={isBusy}>Nuevo ítem</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Unidad</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Controla inv.</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{kindOptions.find((k) => k.value === item.kind)?.label ?? item.kind}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.stock ?? '-'}</TableCell>
              <TableCell>{item.trackInventory ? 'Sí' : 'No'}</TableCell>
              <TableCell>{item.isActive === false ? 'No' : 'Sí'}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" onClick={() => openEdit(item)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => void deleteInventoryItem(item.id)}>Eliminar</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>
                <Typography variant="body2" color="text.secondary">No hay ítems registrados.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>{catalog.inventoryItems.some((i) => i.id === draft.id) ? 'Editar ítem' : 'Nuevo ítem'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              select
              label="Tipo"
              value={draft.kind}
              onChange={(e) => setDraft({ ...draft, kind: e.target.value as InventoryItemKind })}
              fullWidth
            >
              {kindOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Unidad"
              value={draft.unit}
              onChange={(e) => setDraft({ ...draft, unit: e.target.value as RestaurantUnit })}
              fullWidth
            >
              {unitOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Stock"
              type="number"
              value={draft.stock ?? ''}
              onChange={(e) => setDraft({ ...draft, stock: e.target.value === '' ? null : Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Stock mínimo"
              type="number"
              value={draft.minStock ?? ''}
              onChange={(e) => setDraft({ ...draft, minStock: e.target.value === '' ? null : Number(e.target.value) })}
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={!!draft.trackInventory} onChange={(e) => setDraft({ ...draft, trackInventory: e.target.checked })} />}
              label="Controlar inventario"
            />
            <FormControlLabel
              control={<Switch checked={draft.isActive !== false} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />}
              label="Activo"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancelar</Button>
          <Button variant="contained" onClick={() => void handleSave()} disabled={isBusy || !draft.name.trim()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
