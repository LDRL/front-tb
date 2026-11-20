import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
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
  IconButton,
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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { FormInputNumber, FormInputText, FormTextArea } from '@/components';
import { createRestaurantId, useRestaurantCatalog } from '../hooks';
import { Recipe, RecipeComponent, RestaurantUnit } from '../models';

const unitOptions: { value: RestaurantUnit; label: string }[] = [
  { value: 'unit', label: 'Unidad' },
  { value: 'piece', label: 'Pieza' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'portion', label: 'Porción' },
  { value: 'rodaja', label: 'Rodaja'}
];

const emptyComponent = (): RecipeComponent => ({
  inventoryItemId: '',
  quantity: 1,
  unit: 'unit',
  optional: false,
});

const emptyRecipe = (): Recipe => ({
  id: createRestaurantId(),
  name: '',
  description: '',
  components: [],
  isActive: true,
});

export default function RecipesPage() {
  const { catalog, status, error, upsertRecipe, deleteRecipe } = useRestaurantCatalog();
  const [open, setOpen] = useState(false);

  const isBusy = status === 'saving' || status === 'loading';
  const recipes = useMemo(() => catalog.recipes, [catalog.recipes]);
  const inventoryItems = catalog.inventoryItems;

  const { control, handleSubmit, reset, getValues } = useForm<Recipe>({
    defaultValues: emptyRecipe(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'components',
  });

  const watched = useWatch({ control }) as Recipe;

  const openCreate = () => {
    reset(emptyRecipe());
    setOpen(true);
  };

  const openEdit = (recipe: Recipe) => {
    reset({ ...recipe, components: [...(recipe.components || [])] });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const itemName = (id: string) => inventoryItems.find((i) => i.id === id)?.name ?? id;

  const onSubmit = async (data: Recipe) => {
    if (!data.name?.trim()) return;
    const cleaned: Recipe = {
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || '',
      components: (data.components || [])
        .filter((c) => c.inventoryItemId && Number(c.quantity) > 0)
        .map((c) => ({
          ...c,
          quantity: Number(c.quantity),
          unit: c.unit || 'unit',
          optional: !!c.optional,
        })),
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt ?? new Date().toISOString(),
    };
    await upsertRecipe(cleaned);
    setOpen(false);
  };

  const dialogTitle = recipes.some((r) => r.id === getValues('id')) ? 'Editar receta' : 'Nueva receta';

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Recetas</Typography>
        <Button variant="contained" onClick={openCreate} disabled={isBusy}>Nueva receta</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Ingredientes</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe.id}>
              <TableCell>{recipe.name}</TableCell>
              <TableCell>{recipe.description || '-'}</TableCell>
              <TableCell>{recipe.components?.length ?? 0}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" onClick={() => openEdit(recipe)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => void deleteRecipe(recipe.id)}>Eliminar</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {recipes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="body2" color="text.secondary">No hay recetas registradas.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={close} fullWidth maxWidth="md">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Box component="form" id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormInputText name="name" control={control} label="Nombre" rules={{ required: 'Nombre es requerido' }} />
              <FormTextArea name="description" control={control} label="Descripción" rows={2} />

              <Divider />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Ingredientes</Typography>
                <Button startIcon={<AddIcon />} onClick={() => append(emptyComponent())} disabled={inventoryItems.length === 0} type="button">
                  Agregar Ingrediente
                </Button>
              </Stack>
              {inventoryItems.length === 0 && (
                <Alert severity="info">Primero registrá Insumos/Productos para poder armar recetas.</Alert>
              )}

              {fields.map((field, index) => (
                <Box key={field.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Controller
                        name={`components.${index}.inventoryItemId` as const}
                        control={control}
                        render={({ field: f }) => (
                          <TextField {...f} select label="Insumos y Productos" value={f.value || ''} fullWidth size="small">
                            <MenuItem value="">Seleccionar...</MenuItem>
                            {inventoryItems.map((item) => (
                              <MenuItem key={item.id} value={item.id}>{item.name} ({item.unit})</MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                      <IconButton color="error" onClick={() => remove(index)} aria-label="Eliminar Ingrediente">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                      <FormInputNumber name={`components.${index}.quantity` as const} control={control} label="Cantidad" />
                      <Controller
                        name={`components.${index}.unit` as const}
                        control={control}
                        render={({ field: f }) => (
                          <TextField {...f} select label="Unidad" fullWidth size="small">
                            {unitOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                          </TextField>
                        )}
                      />
                      <Controller
                        name={`components.${index}.optional` as const}
                        control={control}
                        render={({ field: f }) => (
                          <FormControlLabel
                            control={<Checkbox checked={!!f.value} onChange={(e) => f.onChange(e.target.checked)} />}
                            label="Se puede quitar en el pedido"
                            sx={{ whiteSpace: 'nowrap' }}
                          />
                        )}
                      />
                    </Stack>
                  </Stack>
                </Box>
              ))}

              {(watched?.components || []).length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Resumen: {(watched.components || []).filter(c => c.inventoryItemId).map(c => `${itemName(c.inventoryItemId)} (${c.quantity} ${c.unit})`).join(', ')}
                </Typography>
              )}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} type="button">Cancelar</Button>
          <Button variant="contained" type="submit" form="recipe-form" disabled={isBusy}>
            Guardar receta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}