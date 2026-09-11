import React, {useMemo, useState } from 'react';
import { FormAutocompleteAsync, FormDate, FormInputNumber } from '@/components';
import { Box, Button, FormHelperText} from '@mui/material';
import {Option, useFetchProductOptions } from '@/hooks/useOption';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import "../BuyCreate/BuyCreate.css"
import { Detail } from '../../models/buy.domain.type';
import debounce from 'just-debounce-it';
import { pageSize } from '@/utils';
import dayjs from 'dayjs';

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
  const [selectedProduct, setSelectedProduct] = useState<Option | null>(null);

  const { data: productOptions = [], isLoading } = useFetchProductOptions(search);

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

  const handleAdd = () => {
    const { amount, cost, codProductPresentation, expirationDate } = getValues();

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

    if (needsExpiration && !expirationDate) {
      setErrors((e: any) => ({ ...e, expirationDate: true }));
      hasError = true;
    }

    if (hasError) return;

    addRow({
      codProductPresentation,
      amount,
      cost,
      subtotal: amount * cost,
      name: selectedProduct?.label ?? "",
      ...(needsExpiration && expirationDate
        ? { expirationDate: dayjs(expirationDate).format("YYYY-MM-DD") }
        : {}),
    });

    setValue("amount", 0);
    setValue("cost", 0);
    setValue("codProductPresentation", undefined);
    setValue("expirationDate", undefined);
    setSelectedProduct(null);
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
      minWidth: 400,
      sortable: false,
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
      sortable: false
      
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      flex:1,
      type: 'number',
      sortable: false
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
          label="Producto"
          options={finalProducts}
          isLoading={isLoading}
          getOptionLabel={(o) => o.label}
          getOptionValue={(o) => o.value}
          onInputChange={debouncedSearch}
          onChangeExternal={(v) => {
            setSelectedProduct(v as Option | null);
            setErrors((e: any) => ({ ...e, expirationDate: false }));
            setValue("expirationDate", undefined);
          }}
        />
      </div>
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
      </div>
    </>
  );
};
