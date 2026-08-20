import React, { useMemo, useState } from 'react';
import { FormAutocompleteAsync, FormInputNumber, FormInputText } from '@/components';
import {
  Box, Button, FormHelperText, Switch, FormControlLabel,
  Select, MenuItem, InputLabel, FormControl, IconButton, Typography, TextField
} from '@mui/material';
import { Option, useFetchPresentacionOptions, useFetchTypeClientsOptions } from '@/hooks/useOption';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import debounce from 'just-debounce-it';
import { Detail, PrecioCliente } from '../../models/product.domain.type';
import { pageSize } from '@/utils';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

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
  const [hasMultiPrice, setHasMultiPrice] = useState(false);
  const [precios, setPrecios] = useState<PrecioCliente[]>([
    { idtipoCli: 0, precio: 0, tipoprecio: '' }
  ]);

  const { data: presentacionOptions = [], isLoading } = useFetchPresentacionOptions(search);
  const { data: typeCliOptions = [] } = useFetchTypeClientsOptions();

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

  // ── Precios sub-form handlers ──

  const handlePrecioChange = (index: number, field: keyof PrecioCliente, value: any) => {
    setPrecios(prev => {
      const updated = [...prev];
      if (field === 'idtipoCli') {
        const option = typeCliOptions.find(o => o.value === Number(value));
        updated[index] = {
          ...updated[index],
          idtipoCli: Number(value),
          tipoprecio: option?.label?.toLowerCase() || '',
        };
      } else {
        updated[index] = { ...updated[index], [field]: Number(value) || 0 };
      }
      return updated;
    });
  };

  const handleAddPrecio = () => {
    setPrecios(prev => [...prev, { idtipoCli: 0, precio: 0, tipoprecio: '' }]);
  };

  const handleRemovePrecio = (index: number) => {
    setPrecios(prev => prev.filter((_, i) => i !== index));
  };

  const resetPrecios = () => {
    setPrecios([{ idtipoCli: 0, precio: 0, tipoprecio: '' }]);
  };

  const resetForm = () => {
    setValue("price", 0);
    setValue("baseQuantity", 0);
    setValue("barCode", "");
    setValue("idPresentation", undefined);
    setHasMultiPrice(false);
    resetPrecios();
  };

  // ── Edit / Cancel / Add ──

  const handleEdit = (row: Detail) => {
    editRow(row);
    setValue("price", row.price);
    setValue("baseQuantity", row.baseQuantity);
    setValue("barCode", row.barCode);
    setValue("idPresentation", row.idPresentation);
    setSelectedPresentation({ value: row.idPresentation, label: row.name || "" });

    const hasPrices = row.precios && row.precios.length > 0;
    setHasMultiPrice(!!hasPrices);
    setPrecios(hasPrices ? [...row.precios!] : [{ idtipoCli: 0, precio: 0, tipoprecio: '' }]);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleToggleMultiPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setHasMultiPrice(checked);
    if (!checked) {
      resetPrecios();
    } else {
      setPrecios(prev =>
        prev.length === 0 ? [{ idtipoCli: 0, precio: 0, tipoprecio: '' }] : prev
      );
    }
  };

  const handleAdd = () => {
    const { price, idPresentation, barCode, baseQuantity } = getValues();

    let hasError = false;

    if (!price || price <= 0) {
      setErrors((e: any) => ({ ...e, price: true }));
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

    // Validate precios when multi-price is on
    if (hasMultiPrice) {
      const validPrecios = precios.filter(p => p.idtipoCli > 0 && p.precio > 0);

      // Check for duplicate tipoCli
      const tipoCliIds = validPrecios.map(p => p.idtipoCli);
      const hasDuplicates = tipoCliIds.length !== new Set(tipoCliIds).size;
      if (hasDuplicates) {
        toast.error("No puede agregar el mismo tipo de cliente más de una vez");
        hasError = true;
      }
    }

    if (hasError) return;

    const validPrecios = precios.filter(p => p.idtipoCli > 0 && p.precio > 0);

    addRow({
      idPresentation,
      price,
      barCode,
      baseQuantity,
      name: selectedPresentation?.label ?? "",
      precios: hasMultiPrice && validPrecios.length > 0 ? validPrecios : undefined,
    });

    resetForm();
    setEditingId(null);
  };

  // ── DataGrid columns ──

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'actions',
      type: 'actions',
      sortable: false,
      headerName: '',
      width: 160,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Button variant='contained' color='success' size='small' onClick={() => handleEdit(params.row)}>Editar</Button>
          <Button variant='contained' color='error' size='small' onClick={() => deleteRow(params.row.id)}>X</Button>
        </div>
      )
    },
    {
      field: 'name',
      headerName: 'Presentacion',
      flex: 1,
      minWidth: 250,
      sortable: false,
    },
    {
      field: 'baseQuantity',
      headerName: 'Cantidad base',
      type: 'number',
      flex: 1,
      sortable: false
    },
    {
      field: 'price',
      headerName: 'Precio',
      flex: 1,
      type: 'number',
      sortable: false
    },
    {
      field: 'barCode',
      headerName: 'Codigo',
      flex: 1,
      type: 'string',
      sortable: false
    },
    {
      field: 'precios',
      headerName: 'Precios por tipo',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const precios = params.row.precios as PrecioCliente[] | undefined;
        if (!precios || precios.length === 0) return <span>—</span>;
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {precios.map((p, i) => (
              <span key={i} style={{
                background: '#e3f2fd',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: '0.75rem',
              }}>
                {p.tipoprecio}: Q {p.precio}
              </span>
            ))}
          </div>
        );
      }
    },
  ];

  // ── Render ──

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
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
            <FormHelperText sx={{ color: 'red' }}>Es un campo requerido</FormHelperText>
          )}
        </div>
        <div>
          <FormInputNumber
            name="baseQuantity"
            label="Cantidad Base"
            control={control}
          />
          {errors.baseQuantity && (
            <FormHelperText sx={{ color: 'red' }}>Es un campo requerido</FormHelperText>
          )}
        </div>
        <div>
          <FormInputText
            name='barCode'
            label='Codigo producto'
            control={control}
          />
          {errors.barCode && (
            <FormHelperText sx={{ color: 'red' }}>Es un campo requerido</FormHelperText>
          )}
        </div>
      </div>

      {/* ── Toggle multi-price ── */}
      <div style={{ margin: '12px 0' }}>
        <FormControlLabel
          control={
            <Switch
              checked={hasMultiPrice}
              onChange={handleToggleMultiPrice}
              color="primary"
            />
          }
          label="Agregar más de un precio por tipo de cliente"
        />
      </div>

      {/* ── Precios sub-form ── */}
      {hasMultiPrice && (
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '12px',
            marginBottom: '12px',
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Precios por tipo de cliente
          </Typography>

          {precios.map((precioEntry, index) => {
            // IDs seleccionados en OTRAS entradas (no la actual)
            const selectedIds = new Set(
              precios
                .filter((_, i) => i !== index)
                .map(p => p.idtipoCli)
                .filter(id => id > 0)
            );

            const availableOptions = typeCliOptions.filter(opt => !selectedIds.has(opt.value));

            return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
              }}
            >
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Tipo cliente</InputLabel>
                <Select
                  value={precioEntry.idtipoCli || ''}
                  label="Tipo cliente"
                  onChange={(e) => handlePrecioChange(index, 'idtipoCli', e.target.value)}
                >
                  {availableOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                type="number"
                label="Precio"
                value={precioEntry.precio || ''}
                onChange={(e) => handlePrecioChange(index, 'precio', e.target.value)}
                sx={{ minWidth: 120 }}
              />


                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemovePrecio(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
            
            </div>
            );
          })}

          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddPrecio}
            sx={{ mt: 1 }}
          >
            Agregar precio
          </Button>
        </Box>
      )}

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
        <Button
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
          color={editingId ? 'success' : 'info'}
          onClick={handleAdd}
        >
          {editingId ? 'Actualizar' : 'Agregar'}
        </Button>
        {editingId && (
          <Button
            variant="outlined"
            sx={{ mt: 2, mb: 2 }}
            color='warning'
            onClick={handleCancelEdit}
          >
            Cancelar
          </Button>
        )}
      </div>

      {/* ── DataGrid ── */}
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
        </Box>
      </div>
    </>
  );
};
