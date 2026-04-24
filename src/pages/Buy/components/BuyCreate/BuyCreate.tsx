import React, {useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate } from 'react-router-dom';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormDate, FormDropdown, FormInputNumber, FormInputText } from '@/components';
import { Box, Button, FormHelperText} from '@mui/material';
import { useForm } from 'react-hook-form';
import { PrivateRoutes } from '@/models';
import {useCreateBuy} from '../../hooks/useBuy'
import { useFetchProviderOptions, useFetchProductOptions } from '@/hooks/useOption';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Loading from '@/components/Loading';
import dayjs from 'dayjs';
import "./BuyCreate.css"
import { toast } from 'react-toastify';
import { Buy, BuyForm, Detail } from '../../models/buy.domain.type';
import { getErrorMessage } from '@/utils/axiosClient';

const BuyCreate: React.FC = () => {
  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const navigate = useNavigate();

  const createBrandMutation = useCreateBuy();
  const { control, handleSubmit, reset, getValues, setValue} = useForm<BuyForm>({
    defaultValues: { id: 0, address: '', name:'', details:[], total:0},
  });

  useEffect(() => {
    reset({ idProvider: undefined, address: '', name:'', date:undefined});
    setSubtitulo("Nuevo")    
  }, []);

  const [rows, setRows] = useState<Detail[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [errors, setErrors] = useState({
    amount: false,
    cost: false,
    idProduct: false,
    detailProduct: false
  });


  const {data: providerOptions, isLoading: isProviderLoading, isError: isProviderError} = useFetchProviderOptions();
  const {data: productOptions, isLoading: isProductLoading, isError: isProductError} = useFetchProductOptions();

  const calculateTotal = (updatedRows: Detail[]) => {
    const newTotal = updatedRows.reduce((acc, row) => acc + (row.subtotal ?? 0), 0);
    setTotal(newTotal);
  };

  const filterProduct = (product: Detail) => rows.filter(p => p.id !== product.id);
  const findProvider = (provider: number) => providerOptions?.find(p=> p.value === provider)

  //
  // ---- Boton para guardar la compra ---- 
  ///
  const onSubmit = async (data: BuyForm) => {
  setErrors({
    amount: false,
    cost: false,
    idProduct: false,
    detailProduct: false,
  });

  if (rows.length === 0) {
    setErrors(prev => ({ ...prev, detailProduct: true }));
    return;
  }

  setLoading(true);

  try {
    const newBuy: Buy = {
      id: 0,
      name: data.name,
      date: dayjs(data.date).toISOString(),
      address: data.address,
      state: true,
      idProvider: data.idProvider!,
      idSucursal: 0,
      idUser: "",
      total: parseFloat(total.toFixed(2)),

      provider: {
        id: data.idProvider!,
        name: data.name,
        address: data.address,
        phone: "",
        email: "",
        state: "",
      },

      details: rows,
    };

    await createBrandMutation.mutateAsync(newBuy);

    toast.success("Compra creada exitosamente");

    navigate(`/private/${PrivateRoutes.BUY}`, {
      replace: true,
    });

  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'actions',
      type: 'actions',
      sortable: false,
      headerName: '',
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <>{<Button variant='contained' color='error' size='small' onClick={() => handleDeleteProduct(params.row)}>X</Button>}</>
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
      headerName: 'Costo',
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
  
  const handleAddProduct = () => {
    const formValues = getValues(); 
  
    const amount = formValues.amount;
    const cost = formValues.cost;
    const idProduct = formValues.codProduct;
  
    setErrors({
      amount: false,
      cost: false,
      idProduct: false,
      detailProduct: false,
    });
    
    let formHasErrors = false;
  
    if (amount === undefined || amount <= 0) {
      setErrors(prev => ({ ...prev, amount: true }));
      formHasErrors = true;
    }
  
    if (cost === undefined || cost <= 0) {
      setErrors(prev => ({ ...prev, cost: true }));
      formHasErrors = true;
    }
  
    if (idProduct === undefined || idProduct <= 0) {
      setErrors(prev => ({ ...prev, idProduct: true }));
      formHasErrors = true;
    }
  
    if (formHasErrors) {
      return;
    }
  

    const selectedProduct = productOptions?.find(product => product.value === idProduct);
    const newAmount = amount ?? 0;
    const newCost = cost ?? 0;
  
    const newDetail: Detail = {
      codProduct: idProduct ?? 0,
      amount: newAmount,
      cost: newCost,
      subtotal: newAmount * newCost,
      name: selectedProduct ? selectedProduct.label : "",
    };
  
    const newRow = { ...newDetail, id: rows.length };
  
    // setRows([...rows, newRow]);

    setRows(prevRows => {
      const updatedRows = [...prevRows, newRow];
      calculateTotal(updatedRows);
      return updatedRows;
    });
  
    // Resetear los valores del formulario
    setValue('amount', 0);
    setValue('cost', 0);  
    setValue('codProduct', undefined);
  };

  const handleDeleteProduct = (product: Detail) => {
    const filteredProduct = filterProduct(product);
    setRows(filteredProduct);
    calculateTotal(filteredProduct);
  }

  return (    
    <div className='container'>
      {loading && (
        <Loading loading/>
      )}

      <CardForm
        titulo='Compra'
        subtitulo={subtitulo}
      >
        <LoadMask/>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div className='container_selector'>
            <FormDropdown
              name="idProvider"
              control={control}
              label="proveedor"
              rules={{ required: 'proveedor es un campo requerido' }}
              options={providerOptions || []}
              externalOnChange={(value) => {
                const numericValue = Number(value);
                const n = findProvider(numericValue)
                //setValue("direction",  `${n?.direction}`)

                setValue("name", n?.label ?? "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });

                setValue("address", n?.direction ?? "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            /> 
          </div>
          
          <div className='section'>
            <FormInputText
              name="address"
              control={control}
              label="Direccion"
              rules={{ required: 'Direccion es un campo requerido' }}
            />
          </div>

          <div className='section'>
            <FormDate
              name="date"
              control={control}
              label='Fecha'
              rules={{required: 'Fecha es un campo requerido'}}
            />
          </div>

          {/* Detalle  */}
          <div style={{border: '1px solid #ccc', borderRadius: '5px', padding: '15px'}} >
            <div style={{ marginBottom: '10px'}}>
              <FormDropdown
                name="codProduct"
                control={control}
                label="producto"
                options={productOptions || []}
              /> 
              
              {errors.idProduct && (
                <FormHelperText sx={{color: 'red'}}>Producto es un campo requerido</FormHelperText>
              )}
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
                label="Costo"
              />
              {errors.cost && (
                <FormHelperText sx={{color: 'red'}}>Costo es un campo requerido</FormHelperText>
              )}
              </div>
            </div>

            <div style={{display:'flex', justifyContent:'flex-end', gap: '5px'}}>
              <Button
                variant="contained"
                // type="submit"
                
                sx={{ mt: 2, mb:2}}
                color='info'
                onClick={handleAddProduct}
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
          </div>

          <div className='container_button'>
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              disabled={createBrandMutation.isPending}
            >
              Guardar
            </Button>
            <Button
              variant="contained"
              type="button"
              sx={{ mt: 2 }}
              color='error'
              onClick={() => navigate('/private/buy')}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  );
};

export default BuyCreate;