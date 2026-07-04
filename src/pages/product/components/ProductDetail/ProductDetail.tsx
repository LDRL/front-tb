import React, {useMemo, useState } from 'react';
import { FormAutocompleteAsync, FormInputNumber, FormInputText } from '@/components';
import { Box, Button, FormHelperText} from '@mui/material';
import {Option, useFetchPresentacionOptions} from '@/hooks/useOption';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
//import "../BuyCreate/BuyCreate.css"

import debounce from 'just-debounce-it';
import { Detail } from '../../models/product.domain.type';

type Props = {
  control: any;
  getValues: any;
  setValue: any;
  addRow: (detail: Detail) => void;
  deleteRow: (id: string) => void;
  editRow: (row: Detail) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  rows: Detail[];
  errors: any;
  setErrors: any;
};

export const DetailCreate: React.FC<Props> = ({
  control,
  getValues,
  setValue,
  addRow,
  deleteRow,
  editRow,
  editingId,
  setEditingId,
  rows,
  errors,
  setErrors
}) => {
  const [search, setSearch] = useState("");
  const [selectedPresentation, setSelectedPresentation] = useState<Option | null>(null);

    const { data: presentacionOptions = [], isLoading } = useFetchPresentacionOptions(search);

  const debouncedSearch = useMemo(
    () => debounce((v: string) => setSearch(v), 300),
    []
  );

  const finalProducts = useMemo(() => {
    if (!selectedPresentation) return presentacionOptions;

    return presentacionOptions.some(o => o.value === selectedPresentation.value)
      ? presentacionOptions
      : [selectedPresentation, ...presentacionOptions];
  }, [presentacionOptions, selectedPresentation]);

  const handleEdit = (row: Detail) => {
    editRow(row);
    setValue("price", row.price);
    setValue("baseQuantity", row.baseQuantity);
    setValue("barCode", row.barCode);
    setValue("idPresentation", row.idPresentation);
    setSelectedPresentation({value: row.idPresentation, label: row.name || ""});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setValue("price", 0);
    setValue("baseQuantity", 0);
    setValue("barCode","");
    setValue("idPresentation", undefined);
  };

  const handleAdd = () => {
    const { price, idPresentation, barCode, baseQuantity } = getValues();

    let hasError = false;

    if (!price || price <= 0) {
      setErrors((e: any) => ({ ...e, price: true }));
      hasError = true;
    }

    if (!barCode || barCode <= 0) {
      setErrors((e: any) => ({ ...e, barCode: true }));
      hasError = true;
    }

    if (!baseQuantity || baseQuantity <= 0) {
      setErrors((e: any) => ({ ...e, baseQuantity: true }));
      hasError = true;
    }

    if (!idPresentation) {
      setErrors((e: any) => ({ ...e, idProduct: true }));
      hasError = true;
    }

    if (hasError) return;

    addRow({
      idPresentation,
      price,
      barCode,
      baseQuantity,
      name: selectedPresentation?.label ?? ""
    });

    setValue("price", 0);
    setValue("baseQuantity", 0);
    setValue("barCode","");
    setValue("idPresentation", undefined);
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'actions',
      type: 'actions',
      sortable: false,
      headerName: '',
      width: 160,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{display:'flex', gap: 4}}>
          <Button variant='contained' color='success' size='small' onClick={() => handleEdit(params.row)}>Editar</Button>
          <Button variant='contained' color='error' size='small' onClick={() => deleteRow(params.row.id)}>X</Button>
        </div>
      )
    },
    {
      field: 'name',
      headerName: 'Presentacion',
      flex:1,
      minWidth: 400,
      sortable: false,
    },
    {
      field: 'baseQuantity',
      headerName: 'Cantidad base',
      type: 'number',
      flex:1,
      sortable: false
    },
    {
      field: 'price',
      headerName: 'Precio',
      flex:1,
      type: 'number',
      sortable: false
      
    },
    {
      field: 'barCode',
      headerName: 'Codigo',
      flex:1,
      type: 'string',
      sortable: false
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '10px'}}>
        <FormAutocompleteAsync
          name="idPresentation"
          control={control}
          label="Presentacion"
          options={finalProducts}
          isLoading={isLoading}
          getOptionLabel={(o) => o.label}
          getOptionValue={(o) => o.value}
          onInputChange={debouncedSearch}
          onChangeExternal={(v) =>
            setSelectedPresentation(v as Option | null)
          }
        />
      </div>
      <div className='container_selector'>
        <div>
            <FormInputNumber
              name="price"
              label="Precio"
              control={control}
            />
            {errors.price && (
                <FormHelperText sx={{color: 'red'}}>Es un campo requerido</FormHelperText>
            )}
        </div>
        <div>
            <FormInputNumber
              name="baseQuantity"
              label="Cantidad Base"
              control={control}
            />
            {errors.baseQuantity && (
                <FormHelperText sx={{color: 'red'}}>Es un campo requerido</FormHelperText>
            )}
            </div>
        <div>
            <FormInputText
              name='barCode'
              label='Codigo producto'
              control={control}
            />
            {errors.barCode && (
                <FormHelperText sx={{color: 'red'}}>Es un campo requerido</FormHelperText>
            )}
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'flex-end', gap: '5px'}}>
        <Button
          variant="contained"
          // type="submit"
          sx={{ mt: 2, mb:2}}
          color={editingId ? 'success' : 'info'}
          onClick={handleAdd}
        >
          {editingId ? 'Actualizar' : 'Agregar'}
        </Button>
        {editingId && (
          <Button
            variant="outlined"
            sx={{ mt: 2, mb:2}}
            color='warning'
            onClick={handleCancelEdit}
          >
            Cancelar
          </Button>
        )}
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
                    pageSize: 10,
                },
                },
            }}
            pageSizeOptions={[10]}
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

