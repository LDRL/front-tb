import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  InputAdornment,
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
import SearchIcon from '@mui/icons-material/Search';
import { FormInputImage, FormInputNumber, FormInputText, FormTextArea } from '@/components';
import { CategoryFormModal } from '@/pages/Category/components/CategoryFormModal';
import { useFetchOptions } from '@/hooks/useOption';
import { createRestaurantId, useRestaurantCatalog } from '../hooks';
import { MenuProduct, MenuProductPriceOption } from '../models';
import ModifierGroupPreview from '../components/ModifierGroupPreview';

type MenuProductForm = {
  id: string;
  name: string;
  categoryId: number | '' | null;
  description: string;
  image: File | string | null;
  recipeId: string;
  price: number | '';
  priceOptions: MenuProductPriceOption[];
  personalizationGroupIds: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const emptyPriceOption = (): MenuProductPriceOption => ({
  id: createRestaurantId(),
  name: '',
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
  priceOptions: [],
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
    priceOptions: (product.priceOptions || []).map((p) => ({ ...p })),
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
  const [selectedPreviewPriceId, setSelectedPreviewPriceId] = useState<string>('');

  const isBusy = status === 'saving' || status === 'loading';
  const products = useMemo(() => catalog.products ?? [], [catalog.products]);
  const recipes = catalog.recipes;
  const modifierGroups = catalog.modifierGroups;
  const inventoryItems = catalog.inventoryItems;

  const { control, handleSubmit, reset, getValues, setValue } = useForm<MenuProductForm>({
    defaultValues: emptyProductForm(),
  });

  const { fields: priceOptionFields, append: appendPriceOption, remove: removePriceOption } = useFieldArray({
    control,
    name: 'priceOptions',
  });

  const watched = useWatch({ control }) as MenuProductForm;
  const hasVariantPrices = priceOptionFields.length > 0;

  const openCreate = () => {
    reset(emptyProductForm());
    setShowRecipeSelector(false);
    setSelectedPreviewPriceId('base');
    setOpen(true);
  };

  const openEdit = (product: MenuProduct) => {
    const form = toMenuProductForm(product);
    reset(form);
    setShowRecipeSelector(!!form.recipeId);
    const firstVariantId = form.priceOptions?.[0]?.id;
    setSelectedPreviewPriceId(form.priceOptions && form.priceOptions.length > 0 ? (firstVariantId || '') : 'base');
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

    const cleanedPriceOptions = (data.priceOptions || [])
      .filter((p) => p.name?.trim())
      .map((p) => ({
        id: p.id || createRestaurantId(),
        name: p.name.trim(),
        price: Number(p.price || 0),
      }));

    const hasVariants = cleanedPriceOptions.length > 0;
    const baseOrMainPrice = hasVariants
      ? cleanedPriceOptions[0].price
      : (data.price === '' || data.price === null || data.price === undefined ? 0 : Number(data.price));

    const cleaned: MenuProduct = {
      id: data.id,
      name: data.name.trim(),
      categoryId: data.categoryId === '' || data.categoryId === null || data.categoryId === undefined ? null : Number(data.categoryId),
      description: data.description?.trim() || '',
      image: imageValue,
      recipeId: data.recipeId || null,
      price: baseOrMainPrice,
      basePrice: baseOrMainPrice,
      priceOptions: cleanedPriceOptions,
      recipes: data.recipeId ? [{ recipeId: data.recipeId, quantity: 1 }] : [],
      personalizationGroupIds: data.personalizationGroupIds || [],
      isActive: data.isActive !== false,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
  const variantPreviewOptions = (watched?.priceOptions || [])
    .filter((p) => p.name?.trim() || Number(p.price) > 0)
    .map((p) => ({ id: p.id, name: p.name || 'Variante', price: Number(p.price || 0) }));

  const previewPriceOptions = hasVariantPrices
    ? variantPreviewOptions
    : [{ id: 'base', name: 'Precio', price: basePriceValue }];

  const effectivePreviewPriceId = previewPriceOptions.some((p) => p.id === selectedPreviewPriceId)
    ? selectedPreviewPriceId
    : (previewPriceOptions[0]?.id || '');

  const selectedPreviewPrice = previewPriceOptions.find((p) => p.id === effectivePreviewPriceId) || previewPriceOptions[0];

  const imagePreviewSrc = useMemo(() => {
    const img = watched?.image;
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img === 'string' && img) return img;
    return '';
  }, [watched?.image]);

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
                          <TextField {...field} select label="Receta" value={field.value || ''} fullWidth size="small">
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
                          onClick={() => { setValue('recipeId', '', { shouldDirty: true }); setShowRecipeSelector(false); }}
                        >
                          Borrar
                        </Button>
                      )}
                    </Stack>
                  )}
                </Box>

                {!hasVariantPrices && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Precio</Typography>
                    <FormInputNumber name="price" control={control} label="Precio" />
                  </Box>
                )}

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2">Opciones de precio (variantes)</Typography>
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      type="button"
                      onClick={() => {
                        appendPriceOption(emptyPriceOption());
                        if (!hasVariantPrices) {
                          setSelectedPreviewPriceId('');
                        }
                      }}
                    >
                      + Agregar otro precio
                    </Button>
                  </Stack>
                  <Stack spacing={1.5}>
                    {priceOptionFields.map((field, index) => (
                      <Box key={field.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                          <FormInputText name={`priceOptions.${index}.name` as const} control={control} label="Nombre de variante" />
                          <Box sx={{ minWidth: 160 }}>
                            <FormInputNumber name={`priceOptions.${index}.price` as const} control={control} label="Precio" />
                          </Box>
                          <Button
                            color="error"
                            startIcon={<DeleteIcon />}
                            type="button"
                            onClick={() => {
                              const removedId = watched?.priceOptions?.[index]?.id;
                              removePriceOption(index);
                              if (selectedPreviewPriceId === removedId) {
                                setSelectedPreviewPriceId('');
                              }
                            }}
                          >
                            Borrar
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                    {priceOptionFields.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Si el producto tiene más de un precio, agregá variantes de precio.
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
                        <Button color="error" startIcon={<DeleteIcon />} type="button" onClick={() => removePersonalization(group.id)}>
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
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Opciones</Typography>
                    {previewPriceOptions.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">Agregá al menos una variante de precio.</Typography>
                    ) : (
                      <>
                        <RadioGroup value={effectivePreviewPriceId} onChange={(e) => setSelectedPreviewPriceId(e.target.value)}>
                          {previewPriceOptions.map((opt) => (
                            <FormControlLabel
                              key={opt.id}
                              value={opt.id}
                              control={<Radio size="small" />}
                              label={`${opt.name || 'Precio'} - Q ${Number(opt.price || 0).toFixed(2)}`}
                            />
                          ))}
                        </RadioGroup>
                        {selectedPreviewPrice && (
                          <Typography variant="caption" color="text.secondary">
                            Seleccionado: {selectedPreviewPrice.name || 'Precio'} (Q {Number(selectedPreviewPrice.price || 0).toFixed(2)})
                          </Typography>
                        )}
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
                            products={inventoryItems}
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
