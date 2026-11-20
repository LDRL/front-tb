import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
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
import { FormInputNumber, FormInputText, FormLabeledNumber } from '@/components';
import { createRestaurantId, useRestaurantCatalog } from '../hooks';
import { InventoryItem, ModifierGroup, ModifierOption, ModifierOptionSourceType, Recipe } from '../models';
import ModifierGroupPreview from '../components/ModifierGroupPreview';

type DraftOption = ModifierOption & { _rowId: string };
type DraftGroupForm = Omit<ModifierGroup, 'options' | 'maxSelections'> & {
  maxSelections?: number | '' | null;
  options: DraftOption[];
};

const createRowId = () => createRestaurantId();

const emptyOption = (): DraftOption => ({
  _rowId: createRowId(),
  id: createRestaurantId(),
  name: '',
  sourceType: 'recipe',
  sourceId: null,
  priceDelta: 0,
  isActive: true,
});

const emptyGroup = (): DraftGroupForm => ({
  id: createRestaurantId(),
  name: '',
  internalLabel: '',
  kind: 'selection',
  selectionType: 'multiple',
  allowRepeat: false,
  minSelections: 0,
  maxSelections: '',
  options: [],
  isActive: true,
});

const getSourceName = (
  opt: { sourceType?: ModifierOptionSourceType; sourceId?: string | null; name?: string },
  recipes: Recipe[],
  products: InventoryItem[]
) => {
  if (opt.sourceType === 'recipe') return recipes.find((r) => r.id === opt.sourceId)?.name ?? '';
  if (opt.sourceType === 'product') return products.find((p) => p.id === opt.sourceId)?.name ?? '';
  return opt.name ?? '';
};

export default function ModifierGroupsPage() {
  const { catalog, status, error, upsertModifierGroup, deleteModifierGroup } = useRestaurantCatalog();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isBusy = status === 'saving' || status === 'loading';
  const groups = useMemo(() => catalog.modifierGroups, [catalog.modifierGroups]);
  const products = useMemo(() => catalog.products ?? [], [catalog.products]);
  const recipes = catalog.recipes;
  const productItems = useMemo(
    () => catalog.inventoryItems.filter((i) => i.kind === 'product' && i.isActive !== false),
    [catalog.inventoryItems]
  );

  const usedInProductsCountByGroupId = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      (p.personalizationGroupIds || []).forEach((id) => {
        map.set(id, (map.get(id) || 0) + 1);
      });
    });
    return map;
  }, [products]);

  const { control, handleSubmit, reset, setValue, getValues } = useForm<DraftGroupForm>({
    defaultValues: emptyGroup(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watched = useWatch({ control }) as DraftGroupForm;

  const openCreate = () => {
    reset(emptyGroup());
    setFormError(null);
    setOpen(true);
  };

  const openEdit = (group: ModifierGroup) => {
    const options: DraftOption[] = (group.options || []).map((o) => ({
      ...o,
      _rowId: createRowId(),
      sourceType: o.sourceType ?? (o.targetRecipeId ? 'recipe' : 'product'),
      sourceId: o.sourceId ?? o.targetRecipeId ?? o.targetInventoryItemId ?? null,
    }));
    reset({
      ...group,
      internalLabel: group.internalLabel ?? '',
      allowRepeat: !!group.allowRepeat,
      minSelections: group.minSelections ?? 0,
      maxSelections: group.maxSelections ?? '',
      options,
    });
    setFormError(null);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const onSubmit = async (data: DraftGroupForm) => {
    setFormError(null);

    const min = Number.isFinite(Number(data.minSelections)) ? Number(data.minSelections) : 0;
    const max = data.maxSelections === '' || data.maxSelections === undefined || data.maxSelections === null
      ? undefined
      : Number(data.maxSelections);

    if (max !== undefined && Number.isFinite(max) && max < min) {
      setFormError('El máximo no puede ser menor que el mínimo.');
      return;
    }

    const cleanedOptions: ModifierOption[] = (data.options || [])
      .filter((o) => !!o.sourceId)
      .map((o) => {
        const { _rowId, ...rest } = o;
        void _rowId;
        const resolvedName = getSourceName(o, recipes, productItems) || o.name || 'Opción';
        const sourceId = o.sourceId || null;
        return {
          ...rest,
          name: resolvedName,
          sourceType: (o.sourceType || 'recipe') as ModifierOptionSourceType,
          sourceId,
          priceDelta: Number(o.priceDelta || 0),
          targetRecipeId: o.sourceType === 'recipe' ? sourceId : null,
          targetInventoryItemId: o.sourceType === 'product' ? sourceId : null,
        } as ModifierOption;
      });

    if (cleanedOptions.length === 0) {
      setFormError('Agregá al menos una opción con receta o producto.');
      return;
    }

    const effectiveMax = max !== undefined && Number.isFinite(max) ? max : undefined;
    const cleaned: ModifierGroup = {
      id: data.id,
      name: (data.name || '').trim(),
      internalLabel: (data.internalLabel || '').trim(),
      kind: data.kind || 'selection',
      selectionType: effectiveMax === 1 && !data.allowRepeat ? 'single' : 'multiple',
      allowRepeat: !!data.allowRepeat,
      required: min > 0,
      minSelections: min,
      maxSelections: effectiveMax,
      options: cleanedOptions,
      isActive: data.isActive !== false,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await upsertModifierGroup(cleaned);
    setOpen(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Personalizaciones</Typography>
        <Button variant="contained" onClick={openCreate} disabled={isBusy}>
          Nueva personalización
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Etiqueta distintiva</TableCell>
            <TableCell>Opciones</TableCell>
            <TableCell>Min / Máx</TableCell>
            <TableCell>Repetición</TableCell>
            <TableCell>Uso en productos</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => {
            const usedCount = usedInProductsCountByGroupId.get(group.id) || 0;
            return (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.internalLabel || '-'}</TableCell>
                <TableCell>{group.options?.length ?? 0}</TableCell>
                <TableCell>{group.minSelections ?? 0} / {group.maxSelections ?? '-'}</TableCell>
                <TableCell>{group.allowRepeat ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  {usedCount > 0 ? (
                    <Chip size="small" color="primary" variant="outlined" label={`Agregado a ${usedCount} producto${usedCount === 1 ? '' : 's'}`} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" onClick={() => openEdit(group)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => void deleteModifierGroup(group.id)}>Eliminar</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
          {groups.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>
                <Typography variant="body2" color="text.secondary">No hay personalizaciones registradas.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={close} fullWidth maxWidth="lg">
        <DialogTitle>
          {groups.some((g) => g.id === getValues('id')) ? 'Editar personalización' : 'Nueva personalización'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="modifier-group-form" onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 1, alignItems: 'flex-start' }}>
              <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                {formError && <Alert severity="error">{formError}</Alert>}

                <FormInputText
                  name="name"
                  control={control}
                  label="Nombre de personalización"
                  rules={{ required: 'Ingresá el nombre de la personalización' }}
                />
                <FormInputText
                  name="internalLabel"
                  control={control}
                  label="Etiqueta distintiva (no es visible para tus clientes)"
                />

                <Divider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">Opciones</Typography>
                  <Button startIcon={<AddIcon />} onClick={() => append(emptyOption())} type="button">
                    Agregar opción
                  </Button>
                </Stack>

                {fields.map((field, index) => {
                  const option = watched?.options?.[index] || field;
                  const sourceType = option?.sourceType || 'recipe';
                  const sourceItems = sourceType === 'recipe' ? recipes : productItems;
                  return (
                    <Box key={field.id} sx={{ p: 0.5 }}>
                      <Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                          <Controller
                            name={`options.${index}.sourceType` as const}
                            control={control}
                            render={({ field: f }) => (
                              <TextField
                                {...f}
                                select
                                label="Tipo"
                                size="small"
                                value={f.value || 'recipe'}
                                onChange={(e) => {
                                  const nextType = e.target.value as ModifierOptionSourceType;
                                  f.onChange(nextType);
                                  setValue(`options.${index}.sourceId`, null);
                                  setValue(`options.${index}.name`, '');
                                }}
                                sx={{ minWidth: 225 }}
                              >
                                <MenuItem value="recipe">Receta</MenuItem>
                                <MenuItem value="product">Producto (ingrediente)</MenuItem>
                              </TextField>
                            )}
                          />

                          <Controller
                            name={`options.${index}.sourceId` as const}
                            control={control}
                            render={({ field: f }) => (
                              <TextField
                                {...f}
                                select
                                label={sourceType === 'product' ? 'Producto' : 'Receta'}
                                size="small"
                                value={f.value ?? ''}
                                onChange={(e) => {
                                  const sourceId = (e.target.value as string) || null;
                                  f.onChange(sourceId);
                                  const resolvedName = getSourceName(
                                    { ...option, sourceType, sourceId },
                                    recipes,
                                    productItems
                                  );
                                  setValue(`options.${index}.name`, resolvedName);
                                }}
                                fullWidth
                              >
                                <MenuItem value="">Seleccionar...</MenuItem>
                                {sourceItems.map((item) => (
                                  <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />

                          <Box sx={{ width: { sm: 140 } }}>
                            <FormInputNumber
                              name={`options.${index}.priceDelta` as const}
                              control={control}
                              label="Precio"
                            />
                          </Box>

                          <Button
                            size="small"
                            type="button"
                            startIcon={<DeleteIcon />}
                            onClick={() => remove(index)}
                            sx={{
                              color: '#808080',
                              borderColor: '#808080',
                              gap: 0,
                              '& .MuiButton-startIcon': { marginRight: '2px' },
                            }}
                          >
                            Borrar
                          </Button>
                        </Stack>

                        {sourceType === 'product' && productItems.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            No hay insumos de tipo Producto activos. Crealos en Ingredientes con tipo "Producto".
                          </Typography>
                        )}
                        {sourceType === 'recipe' && recipes.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            No hay recetas disponibles. Creá recetas primero.
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  );
                })}

                {fields.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Agregá una o más opciones (receta o producto).
                  </Typography>
                )}

                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Permitir repetición de opciones
                  </Typography>
                  <Controller
                    name="allowRepeat"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        row
                        value={field.value ? 'yes' : 'no'}
                        onChange={(e) => field.onChange(e.target.value === 'yes')}
                      >
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                        <FormControlLabel value="yes" control={<Radio />} label="Sí" />
                      </RadioGroup>
                    )}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Si es "Sí", se puede escoger la misma opción más de una vez (ej. BBQ dos veces).
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Cantidad que se podrá seleccionar
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormLabeledNumber
                      name="minSelections"
                      control={control}
                      label="Mínimo"
                      inputProps={{ min: 0 }}
                    />
                    <FormLabeledNumber
                      name="maxSelections"
                      control={control}
                      label="Máximo"
                      allowEmpty
                      emptyValue={undefined}
                      inputProps={{ min: 0 }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Box sx={{ width: { xs: '100%', md: 360 }, flexShrink: 0 }}>
                <ModifierGroupPreview group={(watched as DraftGroupForm) || emptyGroup()} recipes={recipes} products={productItems} />
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} type="button">Cancelar</Button>
          <Button
            variant="contained"
            type="submit"
            form="modifier-group-form"
            disabled={isBusy}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}