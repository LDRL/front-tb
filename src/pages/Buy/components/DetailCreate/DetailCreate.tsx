import React, {useMemo, useState } from 'react';
import { FormAutocompleteAsync, FormDate, FormInputNumber } from '@/components';
import { Box, Button, FormHelperText, useMediaQuery} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import "../BuyCreate/BuyCreate.css"
import { Detail } from '../../models/buy.domain.type';
import debounce from 'just-debounce-it';
import { pageSize } from '@/utils';
import dayjs from 'dayjs';
import { BuyProductOption, BuyVariantOption, useFetchBuyProductOptions } from '../../hooks/useBuyProductOptions';

type Props = {
  control: any;
  getValues: any;
  setValue: any;
  addRow: (detail: Detail) => void;
  deleteRow: (id: string) => void;
  rows: Detail[];
  total: number;
  errors: any;
  setErrors: any;
};

export const DetailCreate: React.FC<Props> = ({
  control,
  getValues,
  setValue,
  addRow,
  deleteRow,
  rows,
  errors,
  setErrors
}) => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<BuyProductOption | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<BuyVariantOption | null>(null);

  const isMobile = useMediaQuery('(max-width: 599px)');

  const { data: productOptions = [], isLoading } = useFetchBuyProductOptions(search);

  const debouncedSearch = useMemo(
    () => debounce((v: string) => setSearch(v), 300),
    []
  );

  const finalProducts = useMemo(() => {
    if (!selectedProduct) return productOptions;

    return productOptions.some(o => o.value === selectedProduct.value)
      ? productOptions
      : [selectedProduct, ...productOptions];
  }, [productOptions, selectedProduct]);

  const needsExpiration = selectedProduct?.hasExpiration ?? false;
  const needsVariant = selectedProduct?.tieneVariantes ?? false;
  const variantOptions = selectedProduct?.variantes ?? [];

  const handleAdd = () => {
    const { amount, cost, codProductPresentation, idvariante, expirationDate } = getValues();

    let hasError = false;

    if (!amount || amount <= 0) {
      setErrors((e: any) => ({ ...e, amount: true }));
      hasError = true;
    }

    if (!cost || cost <= 0) {
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

    if (needsExpiration && !expirationDate) {
      setErrors((e: any) => ({ ...e, expirationDate: true }));
      hasError = true;
    }

    if (hasError) return;

    const variantLabel = needsVariant ? (selectedVariant?.label ?? '') : '';
    const displayName = variantLabel
      ? `${selectedProduct?.label ?? ''} — ${variantLabel}`
      : (selectedProduct?.label ?? '');

    addRow({
      codProductPresentation,
      idvariante: needsVariant ? (idvariante ?? null) : null,
      variantLabel: variantLabel || undefined,
      amount,
      cost,
      subtotal: amount * cost,
      name: displayName,
      ...(needsExpiration && expirationDate
        ? { expirationDate: dayjs(expirationDate).format("YYYY-MM-DD") }
        : {}),
    });

    setValue("amount", 0);
    setValue("cost", 0);
    setValue("codProductPresentation", undefined);
    setValue("idvariante", undefined);
    setValue("expirationDate", undefined);
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
        <>{<Button variant='contained' color='error' size='small' onClick={() => deleteRow(params.row.id)}>X</Button>}</>
      )
    },
    {
      field: 'name',
      headerName: 'Producto',
      flex:1,
      minWidth: 220,
      sortable: false,
    },
    {
      field: 'variantLabel',
      headerName: 'Variante',
      flex:1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => params.row.variantLabel || '-',
    },
    {
      field: 'amount',
      headerName: 'Cantidad compra',
      flex:1,
      sortable: false
    },
    {
      field: 'cost',
      headerName: 'Precio compra',
      flex:1,
      type: 'number',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => <>Q {Number(params.value ?? 0).toFixed(2)}</>
      
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex:1,
      type: 'number',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => <>Q {Number(params.value ?? 0).toFixed(2)}</>
    },
    {
      field: 'expirationDate',
      headerName: 'Vencimiento',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.row.expirationDate ?? '-',
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '10px'}} className='section'>
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
            const option = (v as BuyProductOption | null) ?? null;
            setSelectedProduct(option);
            setSelectedVariant(null);
            setValue("idvariante", undefined);
            setErrors((e: any) => ({ ...e, expirationDate: false, idvariante: false, idProduct: false }));
            setValue("expirationDate", undefined);
          }}
        />
        {errors.idProduct && (
          <FormHelperText sx={{color: 'red'}}>Producto es un campo requerido</FormHelperText>
        )}
      </div>

      {needsVariant && (
        <div style={{ marginBottom: '10px'}} className='section'>
          <FormAutocompleteAsync
            name="idvariante"
            control={control}
            label="Variante (Color / Talla)"
            options={variantOptions}
            getOptionLabel={(o) => o.label}
            getOptionValue={(o) => o.value}
            onChangeExternal={(v) => {
              setSelectedVariant((v as BuyVariantOption | null) ?? null);
              setErrors((e: any) => ({ ...e, idvariante: false }));
            }}
          />
          {errors.idvariante && (
            <FormHelperText sx={{color: 'red'}}>Debe seleccionar una variante para este producto</FormHelperText>
          )}
          {variantOptions.length === 0 && (
            <FormHelperText sx={{color: 'orange'}}>Este producto tiene variantes, pero no hay variantes activas disponibles.</FormHelperText>
          )}
        </div>
      )}

      <div className='container_selector'>
        <div>
          <FormInputNumber
            name="amount"
            control={control}
            label="cantidad compra"
          />
          {errors.amount && (
            <FormHelperText sx={{color: 'red'}}>Cantidad compra es un campo requerido</FormHelperText>
          )}
        </div>
        
        <div>
        <FormInputNumber
          name="cost"
          control={control}
          label="Precio compra"
          startAdornment="Q"
          maxDecimals={2}
        />
        {errors.cost && (
          <FormHelperText sx={{color: 'red'}}>Precio compra es un campo requerido</FormHelperText>
        )}
        </div>

        {needsExpiration && (
        <div>
          <FormDate
            name="expirationDate"
            control={control}
            label='Fecha vencimiento'
            rules={needsExpiration ? {required: 'Fecha vencimiento es un campo requerido'} : undefined}
          />
          {errors.expirationDate && (
            <FormHelperText sx={{color: 'red'}}>Fecha de vencimiento es requerida</FormHelperText>
          )}
        </div>
        )}
      </div>

      <div style={{display:'flex', justifyContent:'flex-end', gap: '5px'}}>
        <Button
          variant="contained"
          // type="submit"
          sx={{ mt: 2, mb:2}}
          color='info'
          onClick={handleAdd}
        >
          Agregar
        </Button>
      </div>

      <div>
        {errors.detailProduct && (
          <FormHelperText sx={{color: 'red'}}>Debe agregar un producto para continuar</FormHelperText>
        )}

        {isMobile ? (
          <div className="detail_cards">
            {rows.length === 0 && (
              <FormHelperText sx={{ color: 'text.secondary' }}>
                Sin productos agregados
              </FormHelperText>
            )}
            {rows.map((row) => (
              <div key={row.id} className="detail_card">
                <div className="detail_card-header">
                  <strong>{row.name}</strong>
                  <Button
                    variant='contained'
                    color='error'
                    size='small'
                    onClick={() => deleteRow(row.id!)}
                  >
                    X
                  </Button>
                </div>
                {row.variantLabel && (
                  <div className="detail_card-row">
                    <label>Variante:</label>
                    <span>{row.variantLabel}</span>
                  </div>
                )}
                <div className="detail_card-row">
                  <label>Vencimiento:</label>
                  <span>{row.expirationDate ?? '-'}</span>
                </div>
                <div className="detail_card-row">
                  <label>Cantidad:</label>
                  <span>{row.amount}</span>
                </div>
                <div className="detail_card-row">
                  <label>Precio compra:</label>
                  <span>Q {row.cost.toFixed(2)}</span>
                </div>
                <div className="detail_card-row">
                  <label>Subtotal:</label>
                  <span>Q {(row.subtotal ?? 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Box sx={{width: '100%'}}>
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
              // checkboxSelection
              disableColumnSelector
              disableRowSelectionOnClick
              disableColumnFilter
              autoHeight
              getRowId={(row:any) => row.id}
            />
          </Box>
        )}
      </div>
    </>
  );
};
