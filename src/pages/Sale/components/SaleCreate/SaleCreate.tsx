import React, { useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm';
import { useNavigate } from 'react-router-dom';
import LoadMask from '@/components/LoadMask/LoadMask';
import { CustomDialog, FormDate, FormInputText } from '@/components';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { PrivateRoutes } from '@/models';

import "./SaleCreate.css";
import { useClientSearch, useCreateSale, useSaleDetails, useFetchPaymentTypes } from '../../hooks/useSale';
import dayjs from 'dayjs';

import { toast } from 'react-toastify';

import Loading from '@/components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { editClient, setSearchNit, clearClient } from '@/redux/clientSlice';
import { dialogOpenSubject$ } from '@/components/CustomDialog/CustomDialog';
import { ClientCreate } from '../ClientCreate';
import { DetailSaleCreate } from '../DetailSaleCreate/DetailSaleCreate';
import { Sale, SaleForm } from '../../models/sale.domain.type';
import { getErrorMessage } from '@/utils/axiosClient';
import { FormDropdown } from '@/components';
import { useFetchTypeClientsOptions } from '@/hooks/useOption';
import { useSesionActual } from '@/pages/Caja/hooks/useCaja';

const SaleCreate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [subtitulo, setSubtitulo] = useState("Nueva");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createSaleMutation = useCreateSale();

  const { control, handleSubmit, reset, getValues, setValue, watch } = useForm<SaleForm>({
    defaultValues: { id: 0, address: '', details: [], idTypePay: 1, isQuote: false },
  });

  const isQuote = watch('isQuote');

  const { rows, total, addRow, deleteRow, clearRows } = useSaleDetails();

  const { data: paymentTypeOptions = [] } = useFetchPaymentTypes();

  const { data: clientTypeOptions = [] } = useFetchTypeClientsOptions();
  const { data: sesionActual } = useSesionActual();

  const [errors, setErrors] = useState({
    amount: false,
    cost: false,
    idProduct: false,
    idvariante: false,
    detailProduct: false,
  });

  const { client, isLoading: isClientLoading } = useClientSearch();

  //SOLO cliente completo
  const currentClient = useSelector((state: any) => state.client.currentClient);

  useEffect(() => {
    if (!currentClient) return;

    setValue('nit', currentClient.nit ?? '');
    setValue('name', `${currentClient.name ?? ''} ${currentClient.lastName ?? ''}`.trim());
    setValue('address', currentClient.direccion ?? '');
    if (currentClient.idTypeCli) {
      setValue('idTypeCli', currentClient.idTypeCli);
    }
  }, [currentClient, setValue]);

  const onSubmit = async (data: SaleForm) => {
    setErrors({
      amount: false,
      cost: false,
      idProduct: false,
      idvariante: false,
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
        isQuote: data.isQuote,
        idTypePay: data.idTypePay,
        idCaja: !data.isQuote && sesionActual?.status === 'ABIERTA' ? sesionActual.cajaId : undefined,

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

        typeOfSale: {id:0, name:''},
        idTypeCli: data.idTypeCli,

        details: rows,
      };

      const result = await createSaleMutation.mutateAsync(newData);

      toast.success("Venta creada exitosamente");
      if (result?.advertencias?.length) {
        toast.warning('La venta se registró, pero hay advertencias de caja. Revisá la sesión de caja.');
      }
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
    dispatch(clearClient());
    dispatch(setSearchNit(''));
    reset({ address: '', date: undefined, nit: '', name: '', idTypeCli: 1, isQuote: false, idTypePay: 1 });
    setSubtitulo('Nueva');

    return () => {
      dispatch(clearClient());
      dispatch(setSearchNit(''));
    };
  }, [reset, dispatch]);
  useEffect(() => {
    if (!client) return;

    setValue('nit', client.nit ?? '');
    setValue('name', `${client.name ?? ''} ${client.lastName ?? ''}`.trim());
    setValue('address', client.direccion ?? '');
    setValue('idTypeCli', client.idTypeCli ?? 0);
  }, [client, setValue]);

  return (
    <div className="">
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

            <Button onClick={searchClient} variant="contained" sx={{borderRadius: 2}}>
              Buscar
            </Button>

            <Button onClick={showModal} variant="contained" color="success" sx={{borderRadius: 2}}>
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

          <div className='section'>
            <FormDropdown
              name="idTypeCli"
              control={control}
              label="Tipo venta"
              options={clientTypeOptions}
            />
          </div>

          <div className='section' style={{borderRadius: 5,  border: '1px solid rgb(204, 204, 204)', paddingInline: '10px'}}>
            <FormControlLabel
              label="Es cotización"
              control={
                <Checkbox
                  name='isQuote'
                  checked={!!isQuote}
                  onChange={(e) => setValue('isQuote', e.target.checked)}
                />
              }
            />
          </div>

          {!isQuote && (
            <div className='section'>
              <FormDropdown
                name="idTypePay"
                control={control}
                label="Forma de pago"
                options={paymentTypeOptions}
              />
            </div>
          )}

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
              clearRows={clearRows}
              rows={rows}
              total={total}
              errors={errors}
              setErrors={setErrors}
            />
          </div>

          <div className="container_button" style={{marginTop: '10px'}}>
            <Button type="submit" variant="contained" sx={{borderRadius:2}}>
              Guardar
            </Button>

            <Button
              onClick={() => navigate('/private/sale')}
              variant="contained"
              color="error"
              sx={{borderRadius: 2}}
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