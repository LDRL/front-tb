import React, {useMemo, useState } from 'react';
import { FormAutocompleteAsync, FormInputNumber } from '@/components';
import { Box, Button, FormHelperText} from '@mui/material';
import {Option, useFetchProductOptions } from '@/hooks/useOption';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
//import "../BuyCreate/BuyCreate.css"
import { Detail } from '../../models/sale.domain.type';

import debounce from 'just-debounce-it';

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

export const DetailSaleCreate: React.FC<Props> = ({
  control,
  getValues,
  setValue,
  addRow,
  deleteRow,
  rows,
  total,
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

  const handleAdd = () => {
    const { amount, cost, codProductPresentation } = getValues();

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

    if (hasError) return;

    addRow({
      codProductPresentation,
      amount,
      cost,
      subtotal: amount * cost,
      name: selectedProduct?.label ?? ""
    });

    setValue("amount", 0);
    setValue("cost", 0);
    setValue("codProductPresentation", undefined);
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
      headerName: 'Cantidad',
      flex:1,
      sortable: false
    },
    {
      field: 'cost',
      headerName: 'Precio',
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
  ];

  return (
    <>
      <div style={{ marginBottom: '10px'}}>
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
            setValue("cost", v?.price);
          }}
        />
      </div>
      <div className='container_selector'>
        <div>
          <FormInputNumber
            name="amount"
            control={control}
            label="cantidad"
          />
          {errors.amount && (
            <FormHelperText sx={{color: 'red'}}>Cantidad es un campo requerido</FormHelperText>
          )}
        </div>
        
        <div>
        <FormInputNumber
          name="cost"
          control={control}
          label="Precio"
        />
        {errors.cost && (
          <FormHelperText sx={{color: 'red'}}>Precio es un campo requerido</FormHelperText>
        )}
        </div>
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
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          disableColumnSelector
          disableRowSelectionOnClick
          disableColumnFilter
          autoHeight
          getRowId={(row:any) => row.id}
        />
          <h3>Total: Q {total.toFixed(2)}</h3>
        </Box>
      </div>
    </>
  );
};

