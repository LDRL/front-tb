import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { FormInputNumber, FormInputText } from '@/components';
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
  { value: 'rodaja', label: 'Rodaja' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'portion', label: 'Porción' },
];

type InventoryItemForm = InventoryItem & {
  stockInput?: number | '' | null;
  minStockInput?: number | '' | null;
};

const emptyItem = (): InventoryItemForm => ({
  id: createRestaurantId(),
  name: '',
  kind: 'ingredient',
  unit: 'unit',
  stock: null,
  minStock: null,
  stockInput: '',
  minStockInput: '',
  trackInventory: true,
  isActive: true,
});

export default function InventoryItemsPage() {
  const { catalog, status, error, upsertInventoryItem, deleteInventoryItem } = useRestaurantCatalog();
  const [open, setOpen] = useState(false);

  const isBusy = status === 'saving' || status === 'loading';
  const items = useMemo(() => catalog.inventoryItems, [catalog.inventoryItems]);

  const { control, handleSubmit, reset, getValues } = useForm<InventoryItemForm>({
    defaultValues: emptyItem(),
  });

  const openCreate = () => {
    reset(emptyItem());
    setOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    reset({
      ...item,
      stockInput: item.stock ?? '',
      minStockInput: item.minStock ?? '',
    });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const onSubmit = async (data: InventoryItemForm) => {
    if (!data.name?.trim()) return;
    await upsertInventoryItem({
      ...data,
      name: data.name.trim(),
      stock:
        data.stockInput === '' || data.stockInput === null || data.stockInput === undefined || Number.isNaN(Number(data.stockInput))
          ? null
          : Number(data.stockInput),
      minStock:
        data.minStockInput === '' || data.minStockInput === null || data.minStockInput === undefined || Number.isNaN(Number(data.minStockInput))
          ? null
          : Number(data.minStockInput),
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt ?? new Date().toISOString(),
    });
    setOpen(false);
  };

  const dialogTitle = catalog.inventoryItems.some((i) => i.id === getValues('id')) ? 'Editar ítem' : 'Nuevo ítem';

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Ingredientes / Ítems</Typography>
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
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Box component="form" id="inventory-item-form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormInputText
                name="name"
                control={control}
                label="Nombre"
                rules={{ required: 'Nombre es requerido' }}
              />

              <Controller
                name="kind"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Tipo" fullWidth>
                    {kindOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Unidad" fullWidth>
                    {unitOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <FormInputNumber name="stockInput" control={control} label="Stock" />
              <FormInputNumber name="minStockInput" control={control} label="Stock mínimo" />

              <Controller
                name="trackInventory"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                    label="Controlar inventario"
                  />
                )}
              />
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value !== false} onChange={(e) => field.onChange(e.target.checked)} />}
                    label="Activo"
                  />
                )}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} type="button">Cancelar</Button>
          <Button variant="contained" type="submit" form="inventory-item-form" disabled={isBusy}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}