import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  InputAdornment,
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
import SearchIcon from '@mui/icons-material/Search';
import { FormInputImage, FormInputNumber, FormInputText, FormTextArea } from '@/components';
import { CategoryFormModal } from '@/pages/Category/components/CategoryFormModal';
import { useFetchOptions } from '@/hooks/useOption';
import { createRestaurantId, useRestaurantCatalog } from '../hooks';
import type { MenuProduct, MenuProductIncludedItem, MenuProductIncludedItemOption, ModifierOptionSourceType } from '../models';
import ModifierGroupPreview from '../components/ModifierGroupPreview';

type MenuProductForm = {
  id: string;
  name: string;
  categoryId: number | '' | null;
  description: string;
  image: File | string | null;
  recipeId: string;
  price: number | '';
  includedItems: MenuProductIncludedItem[];
  personalizationGroupIds: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const emptyIncludedItem = (): MenuProductIncludedItem => ({
  id: createRestaurantId(),
  name: '',
  kind: 'fixed',
  quantity: 1,
  recipeId: '',
  inventoryItemId: null,
  options: [],
  allowRepeat: false,
  allowOptionPrices: false,
  minSelections: 1,
  maxSelections: 1,
});

const emptyIncludedItemOption = (): MenuProductIncludedItemOption => ({
  id: createRestaurantId(),
  name: '',
  sourceType: 'product',
  sourceId: null,
  priceDelta: 0,
  price: 0,
});

const emptyProductForm = (): MenuProductForm => ({
  id: createRestaurantId(),
  name: '',
  categoryId: '',
  description: '',
  image: null,
  recipeId: '',
  price: '',
  includedItems: [],
  personalizationGroupIds: [],
  isActive: true,
});

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });

const toMenuProductForm = (product: MenuProduct): MenuProductForm => {
  const legacyRecipeId = product.recipeId ?? product.recipes?.[0]?.recipeId ?? '';
  return {
    id: product.id,
    name: product.name || '',
    categoryId: product.categoryId ?? '',
    description: product.description || '',
    image: product.image ?? null,
    recipeId: legacyRecipeId || '',
    price: product.price ?? product.basePrice ?? '',
    includedItems: (product.includedItems || []).map((item) => ({
      ...item,
      options: (item.options || []).map((o) => ({ ...o })),
    })),
    personalizationGroupIds: [...(product.personalizationGroupIds || [])],
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};



export default function ProductosPage() {
  const { catalog, status, error, upsertProduct, deleteProduct } = useRestaurantCatalog();
  const { data: categoryOptions = [], refetch: refetchCategories } = useFetchOptions();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [personalizationModalOpen, setPersonalizationModalOpen] = useState(false);
  const [personalizationSearch, setPersonalizationSearch] = useState('');
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [includedFixedRemovals, setIncludedFixedRemovals] = useState<Record<string, Record<number, string[]>>>({});
  const [includedChoiceSelections, setIncludedChoiceSelections] = useState<Record<string, Record<string, number>>>({});
  const [baseRecipeRemovals, setBaseRecipeRemovals] = useState<string[]>([]);

  const isBusy = status === 'saving' || status === 'loading';
  const products = useMemo(() => catalog.products ?? [], [catalog.products]);
  const recipes = catalog.recipes;
  const modifierGroups = catalog.modifierGroups;
  const inventoryItems = catalog.inventoryItems;

  const { control, handleSubmit, reset, getValues, setValue } = useForm<MenuProductForm>({
    defaultValues: emptyProductForm(),
  });

  const { fields: includedItemFields, append: appendIncludedItem, remove: removeIncludedItem } = useFieldArray({
    control,
    name: 'includedItems',
  });

  const watched = useWatch({ control }) as MenuProductForm;
  const hasIncludedOptionPricing = (watched?.includedItems || []).some((i: MenuProductIncludedItem) => i.kind === 'choice' && i.allowOptionPrices);

  const openCreate = () => {
    reset(emptyProductForm());
    setShowRecipeSelector(false);
    setIncludedFixedRemovals({});
    setIncludedChoiceSelections({});
    setBaseRecipeRemovals([]);
    setOpen(true);
  };

  const openEdit = (product: MenuProduct) => {
    const form = toMenuProductForm(product);
    reset(form);
    setShowRecipeSelector(!!form.recipeId);
    setIncludedFixedRemovals({});
    setIncludedChoiceSelections({});
    setBaseRecipeRemovals([]);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const handleCategoryModalClose = () => {
    setCategoryModalOpen(false);
    void queryClient.invalidateQueries({ queryKey: ['dropdownOptions'] });
    void refetchCategories();
  };

  const addPersonalization = (groupId: string) => {
    const current = getValues('personalizationGroupIds') || [];
    if (current.includes(groupId)) return;
    setValue('personalizationGroupIds', [...current, groupId], { shouldDirty: true, shouldTouch: true });
  };

  const removePersonalization = (groupId: string) => {
    const current = getValues('personalizationGroupIds') || [];
    setValue('personalizationGroupIds', current.filter((id) => id !== groupId), { shouldDirty: true, shouldTouch: true });
  };

  const onSubmit = async (data: MenuProductForm) => {
    if (!data.name?.trim()) return;

    let imageValue: string | null = null;
    if (data.image instanceof File) {
      try {
        imageValue = await fileToDataUrl(data.image);
      } catch {
        imageValue = null;
      }
    } else if (typeof data.image === 'string') {
      imageValue = data.image;
    }

    const baseOrMainPrice =
      data.price === '' || data.price === null || data.price === undefined ? 0 : Number(data.price);

    const cleanedIncludedItems = (data.includedItems || [])
      .map((item) => {
        const kind = item.kind === 'choice' ? 'choice' : 'fixed';
        const quantity = Math.max(1, Number(item.quantity || 1));
        if (kind === 'fixed') {
          if (!item.recipeId && !item.inventoryItemId) return null;
          const recipeName = item.recipeId ? recipes.find((r) => r.id === item.recipeId)?.name : undefined;
          const invName = item.inventoryItemId ? inventoryItems.find((i) => i.id === item.inventoryItemId)?.name : undefined;
          return {
            id: item.id || createRestaurantId(),
            name: (item.name || recipeName || invName || '').trim(),
            kind,
            quantity,
            recipeId: item.recipeId || null,
            inventoryItemId: item.inventoryItemId || null,
          } as MenuProductIncludedItem;
        }
        const allowOptionPrices = !!item.allowOptionPrices;
        const options = (item.options || [])
          .filter((o) => o.sourceId)
          .map((o) => {
            const resolvedName =
              (o.name || '').trim() ||
              (o.sourceType === 'recipe'
                ? recipes.find((r) => r.id === o.sourceId)?.name
                : inventoryItems.find((i) => i.id === o.sourceId)?.name) ||
              '';
            return {
              id: o.id || createRestaurantId(),
              name: resolvedName,
              sourceType: (o.sourceType || 'product') as ModifierOptionSourceType,
              sourceId: o.sourceId || null,
              priceDelta: allowOptionPrices ? 0 : Number(o.priceDelta || 0),
              price: Number(o.price || 0),
            };
          });
        if (options.length === 0) return null;
        return {
          id: item.id || createRestaurantId(),
          name: (item.name || '').trim(),
          kind,
          quantity,
          options,
          allowRepeat: !!item.allowRepeat,
          allowOptionPrices,
          minSelections: Number(item.minSelections ?? quantity),
          maxSelections: Number(item.maxSelections ?? quantity),
        } as MenuProductIncludedItem;
      })
      .filter((i): i is MenuProductIncludedItem => !!i);

    const cleaned: MenuProduct = {
      id: data.id,
      name: data.name.trim(),
      categoryId: data.categoryId === '' || data.categoryId === null || data.categoryId === undefined ? null : Number(data.categoryId),
      description: data.description?.trim() || '',
      image: imageValue,
      recipeId: data.recipeId || null,
      price: baseOrMainPrice,
      basePrice: baseOrMainPrice,
      priceOptions: [],
      recipes: data.recipeId ? [{ recipeId: data.recipeId, quantity: 1 }] : [],
      includedItems: cleanedIncludedItems,
      personalizationGroupIds: data.personalizationGroupIds || [],
      isActive: data.isActive !== false,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: data.updatedAt ?? new Date().toISOString(),
    };

    await upsertProduct(cleaned);
    setOpen(false);
  };

  const dialogTitle = products.some((p) => p.id === getValues('id')) ? 'Editar producto' : 'Nuevo producto';
  const selectedPersonalizationIds = watched?.personalizationGroupIds || [];
  const selectedPersonalizations = modifierGroups.filter((g) => selectedPersonalizationIds.includes(g.id));

  const filteredPersonalizations = modifierGroups.filter((g) => {
    const q = personalizationSearch.trim().toLowerCase();
    if (!q) return true;
    return (g.name || '').toLowerCase().includes(q) || (g.internalLabel || '').toLowerCase().includes(q);
  });

  const basePriceValue = Number(watched?.price || 0);

  const imagePreviewSrc = useMemo(() => {
    const img = watched?.image;
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img === 'string' && img) return img;
    return '';
  }, [watched?.image]);

  const previewIncludedItems = ((watched?.includedItems || []) as MenuProductIncludedItem[]);
  const selectedBaseRecipe = watched?.recipeId ? recipes.find((r) => r.id === watched.recipeId) : undefined;
  const baseRecipeRemovableComponents = (selectedBaseRecipe?.components || []).filter((c) => c.optional && c.inventoryItemId);

  let includedChoicesPriceDelta = 0;
  let includedChoicesAbsolute = 0;
  let hasAbsolutePricedSelection = false;
  previewIncludedItems.forEach((item) => {
    if (item.kind !== 'choice') return;
    const selectedMap = includedChoiceSelections[item.id] || {};
    const options = item.options || [];
    Object.entries(selectedMap).forEach(([optId, qty]) => {
      const opt = options.find((o) => o.id === optId);
      if (!opt) return;
      if (item.allowOptionPrices) {
        includedChoicesAbsolute += Number(opt.price || 0) * qty;
        hasAbsolutePricedSelection = true;
      } else {
        includedChoicesPriceDelta += Number(opt.priceDelta || 0) * qty;
      }
    });
  });
  const baseForPreview = hasAbsolutePricedSelection ? 0 : basePriceValue;
  const previewTotalPrice = hasAbsolutePricedSelection
    ? includedChoicesAbsolute
    : baseForPreview + includedChoicesPriceDelta;

  const toggleIncludedFixedRemoval = (itemId: string, instanceIndex: number, componentItemId: string) => {
    setIncludedFixedRemovals((prev) => {
      const itemMap = { ...(prev[itemId] || {}) };
      const current = itemMap[instanceIndex] || [];
      const exists = current.includes(componentItemId);
      const nextList = exists ? current.filter((id) => id !== componentItemId) : [...current, componentItemId];
      if (nextList.length === 0) delete itemMap[instanceIndex];
      else itemMap[instanceIndex] = nextList;
      const next = { ...prev };
      if (Object.keys(itemMap).length === 0) delete next[itemId];
      else next[itemId] = itemMap;
      return next;
    });
  };

  const toggleBaseRecipeRemoval = (componentItemId: string) => {
    setBaseRecipeRemovals((prev) =>
      prev.includes(componentItemId) ? prev.filter((id) => id !== componentItemId) : [...prev, componentItemId]
    );
  };

  const toggleIncludedChoiceOption = (itemId: string, optionId: string, maxQty: number, allowRepeat: boolean) => {
    setIncludedChoiceSelections((prev) => {
      const itemSel = { ...(prev[itemId] || {}) };
      const current = itemSel[optionId] || 0;
      const totalSelected = Object.values(itemSel).reduce((a, b) => a + b, 0);
      const canAddMore = totalSelected < maxQty;

      if (allowRepeat) {
        if (current > 0) {
          delete itemSel[optionId];
        } else if (canAddMore) {
          itemSel[optionId] = 1;
        }
      } else {
        if (current > 0) {
          delete itemSel[optionId];
        } else if (canAddMore) {
          if (maxQty === 1) {
            return { ...prev, [itemId]: { [optionId]: 1 } };
          }
          itemSel[optionId] = 1;
        } else {
          return prev;
        }
      }

      const next = { ...prev };
      if (Object.keys(itemSel).length === 0) delete next[itemId];
      else next[itemId] = itemSel;
      return next;
    });
  };

  const changeIncludedChoiceOptionQty = (itemId: string, optionId: string, delta: number, maxQty: number) => {
    setIncludedChoiceSelections((prev) => {
      const itemSel = { ...(prev[itemId] || {}) };
      const current = itemSel[optionId] || 0;
      let nextQty = current + delta;
      if (nextQty < 0) nextQty = 0;
      const others = Object.entries(itemSel).reduce((acc, [k, v]) => acc + (k === optionId ? 0 : v), 0);
      if (others + nextQty > maxQty) nextQty = Math.max(0, maxQty - others);
      if (nextQty <= 0) delete itemSel[optionId];
      else itemSel[optionId] = nextQty;

      const next = { ...prev };
      if (Object.keys(itemSel).length === 0) delete next[itemId];
      else next[itemId] = itemSel;
      return next;
    });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Productos</Typography>
        <Button variant="contained" onClick={openCreate} disabled={isBusy}>
          Nuevo producto
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Receta</TableCell>
            <TableCell>Personalizaciones</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => {
            const categoryLabel = categoryOptions.find((c) => c.value === product.categoryId)?.label || '-';
            const recipeId = product.recipeId || product.recipes?.[0]?.recipeId;
            const recipeLabel = recipes.find((r) => r.id === recipeId)?.name || '-';
            const displayPrice = Number(product.price ?? product.basePrice ?? 0);
            return (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{categoryLabel}</TableCell>
                <TableCell>Q {displayPrice.toFixed(2)}</TableCell>
                <TableCell>{recipeLabel}</TableCell>
                <TableCell>{product.personalizationGroupIds?.length ?? 0}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" onClick={() => openEdit(product)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => void deleteProduct(product.id)}>Eliminar</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">No hay productos registrados.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={close} fullWidth maxWidth="lg">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="menu-product-form" onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 1, alignItems: 'flex-start' }}>
              <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                <FormInputText name="name" control={control} label="Nombre del producto" rules={{ required: 'Nombre es requerido' }} />

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>Escoger categoría</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select label="Categoría" value={field.value ?? ''} fullWidth size="small">
                          <MenuItem value="">Seleccionar...</MenuItem>
                          {categoryOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    <Button variant="outlined" type="button" onClick={() => setCategoryModalOpen(true)} sx={{ whiteSpace: 'nowrap' }}>
                      + Nueva categoría
                    </Button>
                  </Stack>
                </Box>

                <FormTextArea name="description" control={control} label="Descripción" rows={3} />

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>Imagen</Typography>
                  <FormInputImage name="image" control={control} label="Imagen del producto" />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Receta</Typography>
                  {!showRecipeSelector && !watched?.recipeId ? (
                    <Button variant="outlined" startIcon={<AddIcon />} type="button" onClick={() => setShowRecipeSelector(true)}>
                      Agregar una Receta
                    </Button>
                  ) : (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                      <Controller
                        name="recipeId"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Receta"
                            value={field.value || ''}
                            fullWidth
                            size="small"
                            onChange={(e) => {
                              field.onChange(e);
                              setBaseRecipeRemovals([]);
                            }}
                          >
                            <MenuItem value="">Seleccionar...</MenuItem>
                            {recipes.map((recipe) => (
                              <MenuItem key={recipe.id} value={recipe.id}>{recipe.name}</MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                      {watched?.recipeId && (
                        <Button
                          color="error"
                          startIcon={<DeleteIcon />}
                          type="button"
                          onClick={() => { setValue('recipeId', '', { shouldDirty: true }); setShowRecipeSelector(false); setBaseRecipeRemovals([]); }}
                        >
                          Borrar
                        </Button>
                      )}
                    </Stack>
                  )}
                </Box>

                {!hasIncludedOptionPricing && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Precio</Typography>
                    <FormInputNumber name="price" control={control} label="Precio" />
                  </Box>
                )}

                <Divider />
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2">Insumos incluidos (composición)</Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} type="button" onClick={() => appendIncludedItem(emptyIncludedItem())}>
                      + Agregar Insumo incluido
                    </Button>
                  </Stack>
                  <Stack spacing={1.5}>
                    {includedItemFields.map((field, index) => {
                      const item = (watched?.includedItems?.[index] || field) as MenuProductIncludedItem;
                      const kind = item.kind || 'fixed';
                      const choiceOptions = item.options || [];
                      return (
                        <Box key={field.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Stack spacing={1.5}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                              <Controller
                                name={`includedItems.${index}.name` as any}
                                control={control}
                                render={({ field: f }) => <TextField {...f} label="Nombre / etiqueta" size="small" fullWidth />}
                              />
                              <Controller
                                name={`includedItems.${index}.kind` as any}
                                control={control}
                                render={({ field: f }) => (
                                  <TextField
                                    {...f}
                                    select
                                    label="Tipo"
                                    size="small"
                                    value={f.value || 'fixed'}
                                    sx={{ minWidth: 180 }}
                                    onChange={(e) => {
                                      const val = e.target.value as 'fixed' | 'choice';
                                      f.onChange(val);
                                      if (val === 'choice' && !(getValues(`includedItems.${index}.options` as any) || []).length) {
                                        setValue(`includedItems.${index}.options` as any, [emptyIncludedItemOption()]);
                                      }
                                      if (val === 'fixed') {
                                        setValue(`includedItems.${index}.options` as any, []);
                                      }
                                    }}
                                  >
                                    <MenuItem value="fixed">Receta fija</MenuItem>
                                    <MenuItem value="choice">A elección</MenuItem>
                                  </TextField>
                                )}
                              />
                              <Box sx={{ width: 140 }}>
                                <FormInputNumber name={`includedItems.${index}.quantity` as any} control={control} label="Cantidad" />
                              </Box>
                              <Button color="error" startIcon={<DeleteIcon />} type="button" onClick={() => removeIncludedItem(index)}
                                size='small'
                                sx={{
                                  color: '#808080',
                                  borderColor: '#808080',
                                  gap: 0,
                                  '& .MuiButton-startIcon': {
                                    marginRight: '2px',
                                  },
                                }}
                              >
                                Borrar
                              </Button>
                            </Stack>

                            {kind === 'fixed' ? (
                              <Controller
                                name={`includedItems.${index}.recipeId` as any}
                                control={control}
                                render={({ field: f }) => (
                                  <TextField
                                    {...f}
                                    select
                                    label="Receta base"
                                    size="small"
                                    fullWidth
                                    value={f.value || ''}
                                    onChange={(e) => {
                                      const rid = e.target.value as string;
                                      f.onChange(rid);
                                      const r = recipes.find((x) => x.id === rid);
                                      if (r && !getValues(`includedItems.${index}.name` as any)) {
                                        setValue(`includedItems.${index}.name` as any, r.name);
                                      }
                                    }}
                                  >
                                    <MenuItem value="">Seleccionar...</MenuItem>
                                    {recipes.map((r) => (
                                      <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                                    ))}
                                  </TextField>
                                )}
                              />
                            ) : (
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={2} flexWrap="wrap">
                                  <Controller
                                    name={`includedItems.${index}.allowRepeat` as any}
                                    control={control}
                                    render={({ field: f }) => (
                                      <FormControlLabel
                                        control={<Checkbox checked={!!f.value} onChange={(e) => f.onChange(e.target.checked)} />}
                                        label="Permitir repetir opción"
                                      />
                                    )}
                                  />
                                  <Controller
                                    name={`includedItems.${index}.allowOptionPrices` as any}
                                    control={control}
                                    render={({ field: f }) => (
                                      <FormControlLabel
                                        control={<Checkbox checked={!!f.value} onChange={(e) => f.onChange(e.target.checked)} />}
                                        label="Permitir agregar precios"
                                      />
                                    )}
                                  />
                                </Stack>
                                <Typography variant="caption" color="text.secondary">Opciones a elegir (ej. bebidas)</Typography>
                                {choiceOptions.map((opt, optIndex) => (
                                  <Stack key={opt.id || optIndex} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                                    <Controller
                                      name={`includedItems.${index}.options.${optIndex}.sourceType` as any}
                                      control={control}
                                      render={({ field: f }) => (
                                        <TextField
                                          {...f}
                                          select
                                          label="Tipo"
                                          size="small"
                                          value={f.value || 'product'}
                                          sx={{ minWidth: 150 }}
                                          onChange={(e) => {
                                            f.onChange(e.target.value);
                                            setValue(`includedItems.${index}.options.${optIndex}.sourceId` as any, null);
                                            setValue(`includedItems.${index}.options.${optIndex}.name` as any, '');
                                          }}
                                        >
                                          <MenuItem value="product">Producto</MenuItem>
                                          <MenuItem value="recipe">Receta</MenuItem>
                                        </TextField>
                                      )}
                                    />
                                    <Controller
                                      name={`includedItems.${index}.options.${optIndex}.sourceId` as any}
                                      control={control}
                                      render={({ field: f }) => {
                                        const st = ((watched?.includedItems?.[index]?.options?.[optIndex]?.sourceType || 'product') as string);
                                        const sourceItems = st === 'recipe' ? recipes : inventoryItems.filter((i) => i.kind === 'product');
                                        return (
                                          <TextField
                                            {...f}
                                            select
                                            label={st === 'recipe' ? 'Receta' : 'Producto'}
                                            size="small"
                                            fullWidth
                                            value={f.value || ''}
                                            onChange={(e) => {
                                              const sid = e.target.value as string;
                                              f.onChange(sid);
                                              const resolved = st === 'recipe' ? recipes.find((r) => r.id === sid)?.name : inventoryItems.find((i) => i.id === sid)?.name;
                                              if (resolved) setValue(`includedItems.${index}.options.${optIndex}.name` as any, resolved);
                                            }}
                                          >
                                            <MenuItem value="">Seleccionar...</MenuItem>
                                            {sourceItems.map((si) => (
                                              <MenuItem key={si.id} value={si.id}>{si.name}</MenuItem>
                                            ))}
                                          </TextField>
                                        );
                                      }}
                                    />
                                    {item.allowOptionPrices && (
                                      <Box sx={{ width: 170 }}>
                                        <FormInputNumber
                                          name={`includedItems.${index}.options.${optIndex}.price` as any}
                                          control={control}
                                          label="Precio (Q)"
                                        />
                                      </Box>
                                    )}
                                    <Button
                                      color="error"
                                      size="small"
                                      type="button"
                                      onClick={() => {
                                        const opts = [...(getValues(`includedItems.${index}.options` as any) || [])];
                                        opts.splice(optIndex, 1);
                                        setValue(`includedItems.${index}.options` as any, opts);
                                      }}
                                      
                                      sx={{
                                        color: '#808080',
                                        borderColor: '#808080'
                                      }}
                                    >
                                      Quitar
                                    </Button>
                                  </Stack>
                                ))}
                                <Button
                                  size="small"
                                  startIcon={<AddIcon />}
                                  type="button"
                                  onClick={() => {
                                    const opts = [...(getValues(`includedItems.${index}.options` as any) || []), emptyIncludedItemOption()];
                                    setValue(`includedItems.${index}.options` as any, opts);
                                  }}
                                >
                                  Agregar opción
                                </Button>
                              </Stack>
                            )}
                          </Stack>
                        </Box>
                      );
                    })}
                    {includedItemFields.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Agregá Insumo incluidos para productos compuestos (ej. 2 sándwiches + 2 bebidas).
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Divider />
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2">Personalizaciones</Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} type="button" onClick={() => setPersonalizationModalOpen(true)}>
                      + Agregar personalización
                    </Button>
                  </Stack>
                  <Stack spacing={1}>
                    {selectedPersonalizations.map((group) => (
                      <Box key={group.id} sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{group.name}</Typography>
                          {group.internalLabel && <Typography variant="caption" color="text.secondary">{group.internalLabel}</Typography>}
                        </Box>
                        <Button color="error" startIcon={<DeleteIcon />} type="button" onClick={() => removePersonalization(group.id)}
                          size='small'
                          sx={{
                            color: '#808080',
                            borderColor: '#808080',
                            gap: 0,
                            '& .MuiButton-startIcon': {
                              marginRight: '2px',
                            },
                          }}
                        >
                          Remover
                        </Button>
                      </Box>
                    ))}
                    {selectedPersonalizations.length === 0 && (
                      <Typography variant="body2" color="text.secondary">No hay personalizaciones agregadas.</Typography>
                    )}
                  </Stack>
                </Box>
              </Stack>

              <Box sx={{ width: { xs: '100%', md: 340 }, flexShrink: 0 }}>
                <Card variant="outlined" sx={{ position: 'sticky', top: 8 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Vista previa</Typography>

                    <Box sx={{ width: '100%', aspectRatio: '1 / 1', bgcolor: '#f5f5f5', borderRadius: 1, mb: 1.5, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {imagePreviewSrc ? (
                        <img src={imagePreviewSrc} alt="Producto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sin imagen</Typography>
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{watched?.name || 'Nombre del producto'}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>
                      {watched?.description || 'Descripción del producto'}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{hasIncludedOptionPricing ? 'Precio' : 'Opciones'}</Typography>
                    {hasIncludedOptionPricing ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Precio estimado: Q {previewTotalPrice.toFixed(2)}
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Base: Q {basePriceValue.toFixed(2)}
                          {includedChoicesPriceDelta !== 0 ? ` · Ajuste: ${includedChoicesPriceDelta >= 0 ? '+' : ''}Q ${includedChoicesPriceDelta.toFixed(2)}` : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                          Precio estimado: Q {previewTotalPrice.toFixed(2)}
                        </Typography>
                      </>
                    )}

                    {selectedBaseRecipe && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Receta</Typography>
                        <Box sx={{ p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {selectedBaseRecipe.name}
                          </Typography>
                          {baseRecipeRemovableComponents.length > 0 ? (
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Podés quitar:
                              </Typography>
                              {baseRecipeRemovableComponents.map((comp) => {
                                const ingName = inventoryItems.find((i) => i.id === comp.inventoryItemId)?.name || comp.inventoryItemId;
                                const isRemoved = baseRecipeRemovals.includes(comp.inventoryItemId);
                                return (
                                  <FormControlLabel
                                    key={`base-recipe-${comp.inventoryItemId}`}
                                    sx={{ display: 'flex', ml: 0 }}
                                    control={
                                      <Checkbox
                                        size="small"
                                        checked={isRemoved}
                                        onChange={() => toggleBaseRecipeRemoval(comp.inventoryItemId)}
                                      />
                                    }
                                    label={`Sin ${ingName}`}
                                  />
                                );
                              })}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Sin ingredientes que se puedan quitar.
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}

                    {previewIncludedItems.length > 0 && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Insumos incluidos</Typography>
                        <Stack spacing={1.5}>
                          {previewIncludedItems.map((item) => {
                            const qty = Math.max(1, Number(item.quantity || 1));
                            if (item.kind === 'fixed') {
                              const recipe = item.recipeId ? recipes.find((r) => r.id === item.recipeId) : undefined;
                              const baseName = item.name || recipe?.name || 'Insumo';
                              const removableComponents = (recipe?.components || []).filter((c) => c.optional && c.inventoryItemId);
                              return (
                                <Box key={item.id} sx={{ p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {baseName}{qty > 1 ? ` (x${qty})` : ''}
                                  </Typography>
                                  <Stack spacing={1}>
                                    {Array.from({ length: qty }).map((_, idx) => {
                                      const removed = includedFixedRemovals[item.id]?.[idx] || [];
                                      return (
                                        <Box key={idx} sx={{ pl: qty > 1 ? 1 : 0 }}>
                                          {qty > 1 && (
                                            <Typography variant="caption" color="text.secondary">{baseName} #{idx + 1}</Typography>
                                          )}
                                          {removableComponents.length > 0 ? (
                                            <Box sx={{ pl: qty > 1 ? 1 : 0 }}>
                                              <Typography variant="caption" color="text.secondary" display="block">Podés quitar:</Typography>
                                              {removableComponents.map((comp) => {
                                                const ingName = inventoryItems.find((i) => i.id === comp.inventoryItemId)?.name || comp.inventoryItemId;
                                                const isRemoved = removed.includes(comp.inventoryItemId);
                                                return (
                                                  <FormControlLabel
                                                    key={`${item.id}-${idx}-${comp.inventoryItemId}`}
                                                    sx={{ display: 'flex', ml: 0 }}
                                                    control={
                                                      <Checkbox
                                                        size="small"
                                                        checked={isRemoved}
                                                        onChange={() => toggleIncludedFixedRemoval(item.id, idx, comp.inventoryItemId)}
                                                      />
                                                    }
                                                    label={`Sin ${ingName}`}
                                                  />
                                                );
                                              })}
                                            </Box>
                                          ) : (
                                            qty > 1 ? (
                                              <Typography variant="caption" color="text.secondary" display="block">
                                                Sin Ingredientes removibles configurados.
                                              </Typography>
                                            ) : null
                                          )}
                                        </Box>
                                      );
                                    })}
                                  </Stack>
                                </Box>
                              );
                            }

                            const options = item.options || [];
                            const selectedMap = includedChoiceSelections[item.id] || {};
                            const totalSelected = Object.values(selectedMap).reduce((a, b) => a + b, 0);
                            const canAddMore = totalSelected < qty;
                            const allowRepeat = !!item.allowRepeat;
                            return (
                              <Box key={item.id} sx={{ p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {item.name || 'Selección'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                  Elegí {qty}{allowRepeat ? ' (podés repetir opciones)' : ''}
                                </Typography>
                                {options.length === 0 ? (
                                  <Typography variant="caption" color="text.secondary">Sin opciones configuradas.</Typography>
                                ) : (
                                  <Stack spacing={0.5}>
                                    {options.map((opt) => {
                                      const optName =
                                        opt.name ||
                                        (opt.sourceType === 'recipe'
                                          ? recipes.find((r) => r.id === opt.sourceId)?.name
                                          : inventoryItems.find((i) => i.id === opt.sourceId)?.name) ||
                                        'Opción';
                                      const isPricedMode = !!item.allowOptionPrices;
                                      const price = Number(opt.price || 0);
                                      const delta = Number(opt.priceDelta || 0);
                                      const optLabel = isPricedMode
                                        ? `${optName} - Q ${price.toFixed(2)}`
                                        : (delta ? `${optName} (${delta >= 0 ? '+' : ''}Q ${delta.toFixed(2)})` : optName);
                                      const optQty = selectedMap[opt.id] || 0;
                                      const checked = optQty > 0;
                                      const disabledAdd = !checked && !canAddMore;
                                      return (
                                        <Box key={opt.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                          <FormControlLabel
                                            sx={{ mr: 0, flex: 1 }}
                                            control={
                                              <Checkbox
                                                checked={checked}
                                                disabled={disabledAdd}
                                                onChange={() => toggleIncludedChoiceOption(item.id, opt.id, qty, allowRepeat)}
                                              />
                                            }
                                            label={optLabel}
                                          />
                                          {allowRepeat && checked && (
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                              <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => changeIncludedChoiceOptionQty(item.id, opt.id, -1, qty)}
                                                sx={{ minWidth: 32, px: 0 }}
                                              >
                                                -
                                              </Button>
                                              <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                                                {optQty}
                                              </Typography>
                                              <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => changeIncludedChoiceOptionQty(item.id, opt.id, 1, qty)}
                                                disabled={!canAddMore}
                                                sx={{ minWidth: 32, px: 0 }}
                                              >
                                                +
                                              </Button>
                                            </Stack>
                                          )}
                                        </Box>
                                      );
                                    })}
                                  </Stack>
                                )}
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                  Seleccionadas: {totalSelected} / {qty}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Stack>
                      </>
                    )}

                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Personalizaciones</Typography>
                    {selectedPersonalizations.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">Sin personalizaciones</Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        {selectedPersonalizations.map((group) => (
                          <ModifierGroupPreview
                            key={group.id}
                            group={group}
                            recipes={recipes}
                            inventoryItems={inventoryItems}
                            sticky={false}
                            showHeader={false}
                          />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} type="button">Cancelar</Button>
          <Button variant="contained" type="submit" form="menu-product-form" disabled={isBusy}>
            Guardar producto
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={personalizationModalOpen} onClose={() => setPersonalizationModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar personalizaciones</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Buscar personalización"
              value={personalizationSearch}
              onChange={(e) => setPersonalizationSearch(e.target.value)}
              size="small"
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            />
            <Stack spacing={1}>
              {filteredPersonalizations.map((group) => {
                const isAdded = selectedPersonalizationIds.includes(group.id);
                const togglePersonalization = () => {
                  if (isAdded) removePersonalization(group.id);
                  else addPersonalization(group.id);
                };
                return (
                  <Box
                    key={group.id}
                    onClick={togglePersonalization}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        togglePersonalization();
                      }
                    }}
                    sx={{
                      p: 1.25,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{group.name}</Typography>
                      {group.internalLabel && <Typography variant="caption" color="text.secondary">{group.internalLabel}</Typography>}
                      <Typography variant="caption" color="text.secondary" display="block">
                        {(group.options?.length || 0)} opción(es)
                      </Typography>
                    </Box>
                    {isAdded ? (
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePersonalization(group.id);
                        }}
                      >
                        Remover
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addPersonalization(group.id);
                        }}
                      >
                        Agregar
                      </Button>
                    )}
                  </Box>
                );
              })}
              {filteredPersonalizations.length === 0 && (
                <Typography variant="body2" color="text.secondary">No se encontraron personalizaciones.</Typography>
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPersonalizationModalOpen(false)} type="button">Cerrar</Button>
        </DialogActions>
      </Dialog>

      <CategoryFormModal
        open={categoryModalOpen}
        onClose={handleCategoryModalClose}
        category={null}
      />
    </Box>
  );
}
