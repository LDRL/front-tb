import React, { useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm';
import { useNavigate } from 'react-router-dom';
import LoadMask from '@/components/LoadMask/LoadMask';
import { CustomDialog, FormDate, FormInputText } from '@/components';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { PrivateRoutes } from '@/models';

import "./SaleCreate.css";
import { useClientSearch, useCreateSale, useSaleDetails } from '../../hooks/useSale';
import dayjs from 'dayjs';

import { toast } from 'react-toastify';

import Loading from '@/components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { editClient, setSearchNit } from '@/redux/clientSlice';
import { dialogOpenSubject$ } from '@/components/CustomDialog/CustomDialog';
import { ClientCreate } from '../ClientCreate';
import { DetailSaleCreate } from '../DetailSaleCreate/DetailSaleCreate';
import { Sale, SaleForm } from '../../models/sale.domain.type';
import { getErrorMessage } from '@/utils/axiosClient';

const SaleCreate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [subtitulo, setSubtitulo] = useState("Nuevo");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createSaleMutation = useCreateSale();

  const { control, handleSubmit, reset, getValues, setValue } = useForm<SaleForm>({
    defaultValues: { id: 0, address: '', details: [] },
  });

  const { rows, total, addRow, deleteRow } = useSaleDetails();

  const [errors, setErrors] = useState({
    amount: false,
    cost: false,
    idProduct: false,
    detailProduct: false,
  });

  const { client, isLoading: isClientLoading, error: isClientError } = useClientSearch();

  //SOLO cliente completo
  const currentClient = useSelector((state: any) => state.client.currentClient);

  useEffect(() => {

    if (!currentClient) return;

    setValue('nit', currentClient.nit ?? '');
    setValue('name',`${currentClient.name ?? ''} ${currentClient.lastName ?? ''}`.trim() );
    setValue('address', currentClient.direccion ?? '');

  }, [currentClient, setValue]);

  const onSubmit = async (data: SaleForm) => {
    setErrors({
      amount: false,
      cost: false,
      idProduct: false,
      detailProduct: false,
    });

    if (data.date) {
      data.date = dayjs(data.date).toISOString();
    }

    if (rows.length === 0) {
      setErrors(prev => ({ ...prev, detailProduct: true }));
      return;
    }

    setLoading(true);

    try {
      const newData: Sale = {
        id: 0,
        name: data.name,
        date: dayjs(data.date).toISOString(),
        address: data.address,

        idClient: currentClient?.id ?? 0,

        idSucursal: 0,
        idUser: "",
        total: parseFloat(total.toFixed(2)),

        client: currentClient ?? {
          id: 0,
          nit: '',
          name: '',
          lastName: '',
          direccion: '',
          email: '',
          telefono: '',
          estado: 1,
        },

        details: rows,
      };

      await createSaleMutation.mutateAsync(newData);

      toast.success("Venta creada exitosamente");
      navigate(`/private/${PrivateRoutes.SALE}`, { replace: true });

    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const searchClient = () => {

    const nit = getValues("nit")?.trim();

    if (!nit) {
      toast.error("Ingrese un NIT");
      return;
    }

    dispatch(editClient(null));

    dispatch(setSearchNit(nit));
  };

  const showModal = () => {
    dialogOpenSubject$.setSubject = true;
  };

  useEffect(() => {
    reset({ address: '', date: undefined });
    setSubtitulo("Nuevo");
  }, [reset]);

  useEffect(() => {
    if (!client) return;

    setValue('nit', client.nit ?? '');
    setValue('name',`${currentClient.name ?? ''} ${currentClient.lastName ?? ''}`.trim() );
    setValue('address', client.direccion ?? '');
  }, [client, setValue]);

  return (
    <div className="container">

      {loading && <Loading loading />}

      <CustomDialog>
        <ClientCreate />
      </CustomDialog>

      <CardForm titulo="Venta" subtitulo={subtitulo}>
        <LoadMask />

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >

          <div className="container_selector">
            <FormInputText
              name="nit"
              control={control}
              label="Nit"
              rules={{ required: 'NIT es requerido' }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  const nit = getValues("nit")?.trim();

                  if (nit) {
                    searchClient();
                  }
                }
              }}
            />

            <Button onClick={searchClient} variant="contained">
              Buscar
            </Button>

            <Button onClick={showModal} variant="contained" color="success">
              Agregar
            </Button>
          </div>

          <div className="section">
            <FormInputText
              name="name"
              control={control}
              label="Nombre"
              disabled={isClientLoading}
              rules={{ required: 'Nombre es requerido' }}
            />
          </div>

          <div className="section">
            <FormInputText
              name="address"
              control={control}
              label="Dirección"
              rules={{ required: 'Dirección es requerido' }}
            />
          </div>

          <div className="section">
            <FormDate
              name="date"
              control={control}
              label="Fecha"
              rules={{ required: 'Fecha es requerida' }}
              defaultValue={dayjs()}
              disabled
            />
          </div>

          <div style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '15px'
          }}>
            <DetailSaleCreate
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

          <div className="container_button">
            <Button type="submit" variant="contained">
              Guardar
            </Button>

            <Button
              onClick={() => navigate('/private/sale')}
              variant="contained"
              color="error"
            >
              Cancelar
            </Button>
          </div>

        </Box>
      </CardForm>

    </div>
  );
};

export default SaleCreate;