import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FormAutocompleteAsync, FormInputNumber } from '@/components';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormHelperText } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Detail } from '../../models/sale.domain.type';
import debounce from 'just-debounce-it';
import { pageSize } from '@/utils';
import {
  SaleProductOption,
  SaleVariantOption,
  useFetchSaleProductOptions,
} from '../../hooks/useSaleProductOptions';

type Props = {
  control: any;
  getValues: any;
  setValue: any;
  addRow: (detail: Detail) => void;
  deleteRow: (id: string) => void;
  clearRows: () => void;
  rows: Detail[];
  total: number;
  errors: any;
  setErrors: any;
};

export const DetailSaleCreate: React.FC<Props> = ({
  control,
  getValues,
  setValue,
  addRow,
  deleteRow,
  clearRows,
  rows,
  total,
  errors,
  setErrors,
}) => {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<SaleProductOption | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<SaleVariantOption | null>(null);
  const idTypeCli = useWatch({ control, name: 'idTypeCli' }) as number | undefined;
  const { data: productOptions = [], isLoading } = useFetchSaleProductOptions(search, idTypeCli);

  // Al cambiar el tipo de cliente los precios cambian: se pide confirmación y se limpian los productos agregados
  const prevIdTypeCli = useRef<number | undefined>(idTypeCli);
  const [pendingTypeChange, setPendingTypeChange] = useState<{
    from: number | undefined;
    to: number | undefined;
  } | null>(null);

  useEffect(() => {
    const prev = prevIdTypeCli.current;
    if (prev === idTypeCli) return;

    // Sin productos el cambio es directo
    if (rows.length === 0) {
      prevIdTypeCli.current = idTypeCli;
      return;
    }

    setPendingTypeChange({ from: prev, to: idTypeCli });
  }, [idTypeCli, rows.length]);

  const handleAcceptTypeChange = () => {
    const change = pendingTypeChange;
    setPendingTypeChange(null);

    if (!change) return;

    prevIdTypeCli.current = change.to;
    clearRows();
    setSelectedProduct(null);
    setSelectedVariant(null);
    setValue('idvariante', undefined);
  };

  const handleCancelTypeChange = () => {
    const change = pendingTypeChange;
    setPendingTypeChange(null);

    if (!change) return;

    // Revertir el dropdown al tipo anterior, no se limpia la grilla
    setValue('idTypeCli', change.from);
  };

  const debouncedSearch = useMemo(() => debounce((v: string) => setSearch(v), 300), []);

  const finalProducts = useMemo(() => {
    if (!selectedProduct) return productOptions;
    return productOptions.some((o) => o.value === selectedProduct.value)
      ? productOptions
      : [selectedProduct, ...productOptions];
  }, [productOptions, selectedProduct]);

  const needsVariant = selectedProduct?.tieneVariantes ?? false;
  const variantOptions = selectedProduct?.variantes ?? [];

  const handleAdd = () => {
    const { amount, cost, codProductPresentation, idvariante } = getValues();
    const normalizedAmount = Number(amount);

    let hasError = false;

    if (!normalizedAmount || normalizedAmount <= 0) {
      setErrors((e: any) => ({ ...e, amount: true }));
      hasError = true;
    }

    if (!cost || Number(cost) <= 0) {
      setErrors((e: any) => ({ ...e, cost: true }));
      hasError = true;
    }

    if (!codProductPresentation) {
      setErrors((e: any) => ({ ...e, idProduct: true }));
      hasError = true;
    }

    if (needsVariant && !idvariante) {
      setErrors((e: any) => ({ ...e, idvariante: true }));
      hasError = true;
    }

    if (hasError || !selectedProduct) return;

    const productCode = selectedProduct.codigoprod;
    const resolvedVariantId = needsVariant ? Number(idvariante) : null;
    const availableStock = needsVariant
      ? (selectedVariant?.stock ?? null)
      : (selectedProduct.stock ?? null);
    const baseQuantity = selectedProduct.baseQuantity > 0 ? selectedProduct.baseQuantity : 1;

    if (availableStock != null) {
      const poolStock = Number(availableStock);
      const consumedBase = rows.reduce((acc, row) => {
        const samePool =
          (row.productCode ?? null) === productCode &&
          (row.idvariante ?? null) === (resolvedVariantId ?? null);
        if (!samePool) return acc;
        const rowBaseQty = row.baseQuantity && row.baseQuantity > 0 ? row.baseQuantity : 1;
        return acc + row.amount * rowBaseQty;
      }, 0);

      const requestedBase = normalizedAmount * baseQuantity;
      const remainingBase = poolStock - consumedBase;

      if (remainingBase <= 0 || requestedBase > remainingBase) {
        const maxAdd = Math.max(0, Math.floor(remainingBase / baseQuantity));
        if (maxAdd > 0) {
          toast.warning(`No hay stock suficiente. Máximo disponible: ${maxAdd} para esta presentación.`);
          setValue('amount', maxAdd);
        } else {
          toast.warning('No hay stock disponible para este producto o variante.');
        }
        return;
      }
    }

    const variantLabel = needsVariant ? (selectedVariant?.label ?? '') : '';
    const displayName = variantLabel
      ? `${selectedProduct?.label ?? ''} — ${variantLabel}`
      : (selectedProduct?.label ?? '');

    addRow({
      codProductPresentation,
      idvariante: resolvedVariantId,
      variantLabel: variantLabel || undefined,
      amount: normalizedAmount,
      cost: Number(cost),
      subtotal: normalizedAmount * Number(cost),
      name: displayName,
      productCode,
      baseQuantity,
      availableStock,
    });

    setValue('amount', 0);
    setValue('cost', 0);
    setValue('codProductPresentation', undefined);
    setValue('idvariante', undefined);
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'actions',
      type: 'actions',
      sortable: false,
      headerName: '',
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <Button variant="contained" color="error" size="small" onClick={() => deleteRow(params.row.id)}>
          X
        </Button>
      ),
    },
    {
      field: 'name',
      headerName: 'Producto',
      flex: 1,
      minWidth: 300,
      sortable: false,
    },
    {
      field: 'variantLabel',
      headerName: 'Variante',
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => params.row.variantLabel || '-',
    },
    {
      field: 'amount',
      headerName: 'Cantidad venta',
      flex: 1,
      sortable: false,
    },
    {
      field: 'cost',
      headerName: 'Precio venta',
      flex: 1,
      type: 'number',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => <>Q {Number(params.value ?? 0).toFixed(2)}</>,
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex: 1,
      type: 'number',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => <>Q {Number(params.value ?? 0).toFixed(2)}</>,
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <FormAutocompleteAsync
          name="codProductPresentation"
          control={control}
          label="Producto / Presentación"
          options={finalProducts}
          isLoading={isLoading}
          getOptionLabel={(o) => o.label}
          getOptionValue={(o) => o.value}
          onInputChange={debouncedSearch}
          onChangeExternal={(v) => {
            const option = (v as SaleProductOption | null) ?? null;
            setSelectedProduct(option);
            setSelectedVariant(null);
            setValue('idvariante', undefined);
            setValue('cost', option?.price);
            setErrors((e: any) => ({ ...e, idProduct: false, idvariante: false }));
          }}
        />
        {errors.idProduct && (
          <FormHelperText sx={{ color: 'red' }}>Producto es un campo requerido</FormHelperText>
        )}
      </div>

      {needsVariant && (
        <div style={{ marginBottom: '10px' }}>
          <FormAutocompleteAsync
            name="idvariante"
            control={control}
            label="Variante (Color / Talla)"
            options={variantOptions}
            getOptionLabel={(o) => o.label}
            getOptionValue={(o) => o.value}
            onChangeExternal={(v) => {
              setSelectedVariant((v as SaleVariantOption | null) ?? null);
              setErrors((e: any) => ({ ...e, idvariante: false }));
            }}
          />
          {errors.idvariante && (
            <FormHelperText sx={{ color: 'red' }}>Debe seleccionar una variante para este producto</FormHelperText>
          )}
          {variantOptions.length === 0 && (
            <FormHelperText sx={{ color: 'orange' }}>
              Este producto tiene variantes, pero no hay variantes activas disponibles.
            </FormHelperText>
          )}
        </div>
      )}

      <div className="container_selector">
        <div>
          <FormInputNumber name="amount" control={control} label="Cantidad venta" />
          {errors.amount && (
            <FormHelperText sx={{ color: 'red' }}>Cantidad venta es un campo requerido</FormHelperText>
          )}
        </div>

        <div>
          <FormInputNumber name="cost" control={control} label="Precio venta" startAdornment="Q" maxDecimals={2} />
          {errors.cost && (
            <FormHelperText sx={{ color: 'red' }}>Precio venta es un campo requerido</FormHelperText>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
        <Button variant="contained" sx={{ mt: 2, mb: 2, borderRadius: 2 }} color="info" onClick={handleAdd}>
          Agregar
        </Button>
      </div>

      <div>
        {errors.detailProduct && (
          <FormHelperText sx={{ color: 'red' }}>Debe agregar un producto para continuar</FormHelperText>
        )}
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pageSize,
                },
              },
            }}
            pageSizeOptions={[pageSize]}
            disableColumnSelector
            disableRowSelectionOnClick
            disableColumnFilter
            autoHeight
            getRowId={(row: any) => row.id}
          />
          <h3>Total: Q {total.toFixed(2)}</h3>
        </Box>
      </div>

      <Dialog open={pendingTypeChange !== null} onClose={handleCancelTypeChange}>
        <DialogTitle>Cambiar tipo de venta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hay productos agregados con precios del tipo de venta actual. Si continúa se eliminarán todos los productos
            del detalle. ¿Desea continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelTypeChange} color="error">
            No
          </Button>
          <Button onClick={handleAcceptTypeChange} variant="contained" autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


