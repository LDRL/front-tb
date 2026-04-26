import React, {useEffect, useMemo, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate } from 'react-router-dom';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormAutocompleteAsync, FormDate, FormInputText } from '@/components';
import { Box, Button} from '@mui/material';
import { useForm } from 'react-hook-form';
import { PrivateRoutes } from '@/models';
import {useBuyDetails, useCreateBuy} from '../../hooks/useBuy'
import {Option, useFetchProviderOptions } from '@/hooks/useOption';
import Loading from '@/components/Loading';
import dayjs from 'dayjs';
import "./BuyCreate.css"
import { toast } from 'react-toastify';
import { Buy, BuyForm } from '../../models/buy.domain.type';
import { getErrorMessage } from '@/utils/axiosClient';
import debounce from 'just-debounce-it';
import { DetailCreate } from '../DetailCreate/DetailCreate';

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

  const { rows, total, addRow, deleteRow } = useBuyDetails();

  const [errors, setErrors] = useState({
    amount: false,
    cost: false,
    idProduct: false,
    detailProduct: false
  });

  const [providerSearch, setProviderSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Option | null>(null);
  const { data: providerOptions = [], isLoading: isProvidersLoading } = useFetchProviderOptions(providerSearch);

  const debouncedSearchProvider = useMemo(
    () =>
      debounce((value: string) => {
        setProviderSearch(value);
      }, 300),
    []
  );
  
  const finalOptions = useMemo(() => {
    const base = providerOptions;

    if (!selectedProvider) return base;

    const exists = base.some(o => o.value === selectedProvider.value);

    return exists ? base : [selectedProvider, ...base];
  }, [providerOptions, selectedProvider]);

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
          <div style={{ marginBottom: "10px" }}>
            <FormAutocompleteAsync
              name="idProvider"
              control={control}
              label="Proveedor"
              
              options={finalOptions}     // 👈 React Query data
              isLoading={isProvidersLoading}

              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}

              onInputChange={(value) => {
                debouncedSearchProvider(value);
              }}

              onChangeExternal={(value) => {
                setSelectedProvider(value);
                setValue("name", value?.label ?? "");
                setValue("address", value?.direction ?? "");
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
            <DetailCreate
              control={control}
              getValues={getValues}
              setValue={setValue}
              addRow={addRow}
              deleteRow={deleteRow}
              rows={rows}
              total={total}
              errors={errors}
              setErrors={setErrors}
            />
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