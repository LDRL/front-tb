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
import { Recipe, RecipeComponent, RestaurantUnit } from '../models';

const unitOptions: { value: RestaurantUnit; label: string }[] = [
  { value: 'unit', label: 'Unidad' },
  { value: 'piece', label: 'Pieza' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'portion', label: 'Porción' },
];

const emptyComponent = (): RecipeComponent => ({
  inventoryItemId: '',
  quantity: 1,
  unit: 'unit',
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
  const [draft, setDraft] = useState<Recipe>(emptyRecipe());

  const isBusy = status === 'saving' || status === 'loading';
  const recipes = useMemo(() => catalog.recipes, [catalog.recipes]);
  const inventoryItems = catalog.inventoryItems;

  const openCreate = () => {
    setDraft(emptyRecipe());
    setOpen(true);
  };

  const openEdit = (recipe: Recipe) => {
    setDraft({ ...recipe, components: [...(recipe.components || [])] });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const updateComponent = (index: number, patch: Partial<RecipeComponent>) => {
    setDraft((prev) => {
      const components = [...prev.components];
      components[index] = { ...components[index], ...patch };
      return { ...prev, components };
    });
  };

  const addComponent = () => setDraft((prev) => ({ ...prev, components: [...prev.components, emptyComponent()] }));
  const removeComponent = (index: number) =>
    setDraft((prev) => ({ ...prev, components: prev.components.filter((_, i) => i !== index) }));

  const itemName = (id: string) => inventoryItems.find((i) => i.id === id)?.name ?? id;

  const handleSave = async () => {
    if (!draft.name.trim()) return;
    const cleaned: Recipe = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description?.trim() || '',
      components: draft.components
        .filter((c) => c.inventoryItemId && Number(c.quantity) > 0)
        .map((c) => ({
          ...c,
          quantity: Number(c.quantity),
          unit: c.unit || 'unit',
        })),
      updatedAt: new Date().toISOString(),
      createdAt: draft.createdAt ?? new Date().toISOString(),
    };
    await upsertRecipe(cleaned);
    setOpen(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Recetas / BOM</Typography>
        <Button variant="contained" onClick={openCreate} disabled={isBusy}>Nueva receta</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Componentes</TableCell>
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
        <DialogTitle>{recipes.some((r) => r.id === draft.id) ? 'Editar receta' : 'Nueva receta'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} fullWidth required />
            <TextField label="Descripción" value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} fullWidth multiline minRows={2} />

            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Componentes (BOM)</Typography>
              <Button startIcon={<AddIcon />} onClick={addComponent} disabled={inventoryItems.length === 0}>Agregar componente</Button>
            </Stack>
            {inventoryItems.length === 0 && (
              <Alert severity="info">Primero registrá insumos/ítems para poder armar recetas.</Alert>
            )}

            {draft.components.map((comp, idx) => (
              <Box key={`${comp.inventoryItemId}-${idx}`} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      select
                      label="Insumo / Ítem"
                      value={comp.inventoryItemId}
                      onChange={(e) => updateComponent(idx, { inventoryItemId: e.target.value })}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">Seleccionar...</MenuItem>
                      {inventoryItems.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name} ({item.unit})</MenuItem>
                      ))}
                    </TextField>
                    <IconButton color="error" onClick={() => removeComponent(idx)} aria-label="Eliminar componente"><DeleteIcon /></IconButton>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="Cantidad" type="number" value={comp.quantity} onChange={(e) => updateComponent(idx, { quantity: Number(e.target.value) })} fullWidth size="small" />
                    <TextField select label="Unidad" value={comp.unit} onChange={(e) => updateComponent(idx, { unit: e.target.value as RestaurantUnit })} fullWidth size="small">
                      {unitOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </TextField>
                  </Stack>
                </Stack>
              </Box>
            ))}
            {draft.components.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                Resumen: {draft.components.filter(c => c.inventoryItemId).map(c => `${itemName(c.inventoryItemId)} (${c.quantity} ${c.unit})`).join(', ')}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancelar</Button>
          <Button variant="contained" onClick={() => void handleSave()} disabled={isBusy || !draft.name.trim()}>
            Guardar receta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
