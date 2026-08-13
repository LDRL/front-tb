import { useNavigate, useParams } from "react-router-dom";
import { useShowSale, useFetchPaymentTypes } from "../../hooks/useSale";
import { CSSProperties, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import LoadMask from "@/components/LoadMask/LoadMask";
import { Box, Button } from "@mui/material";
import CardForm from "@/components/Cards/CardForm";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { CustomDialog, FormDate, FormInputText } from "@/components";
import { dialogOpenSubject$ } from "@/components/CustomDialog/CustomDialog";
import { ConfirmSale } from "../ConfirmSale";

import { useForm } from 'react-hook-form';
import dayjs from "dayjs";

import { HeaderS } from "../../models/sale.view.type";
import { HeaderSaleAdapter } from "../../adapter";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
}

function BuyShow() {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const { data, isLoading, isError } = id ? useShowSale(id) : { data: null, isLoading: false, isError: false };
  const adaptedData = data ? HeaderSaleAdapter(data.data):null;

  const { control, reset, setValue } = useForm<HeaderS>({
    defaultValues: { id:0, date: dayjs(), address: '', total:0, idState: 0, paymentType: '' }
  });

  const idState = adaptedData?.header.idState ?? 0;

  const { data: paymentTypeOptions = [] } = useFetchPaymentTypes();

  const paymentTypeName = paymentTypeOptions.find(p => p.value === adaptedData?.pay.idPaymentType)?.label ?? '';


  const [color] = useState("#ffffff")

  const columns: GridColDef[] = [
    {
        field: 'product',
        headerName: 'Producto',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        width: 90
    },
    {
        field: 'amount',
        headerName: 'Cantidad',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        width:150
    },
    {
        field: 'cost',
        headerName: 'Precio',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        width:150
    },

  ];

  useEffect(() => {
    if (adaptedData?.header.id) {
      reset(adaptedData.header);
    }
  }, [adaptedData?.header.id]);

  useEffect(() => {
    if (paymentTypeName) {
      setValue('paymentType', paymentTypeName);
    }
  }, [paymentTypeName, setValue]);
  
  if (isError) {
    return (
      <div className="container">
        <h2>Error al cargar los datos de la Venta.</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <h2>No se encontraron datos de la venta.</h2>
      </div>
    );
  }

  return (
    <div className='container'>
      {isLoading && (
        <div className="sweet-loading">
          <ClipLoader
            color={color}
            loading={isLoading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      <CustomDialog>
        <ConfirmSale id={id ?? ''} />
      </CustomDialog>

      <CardForm
        titulo={idState === 1 ? 'Cotización' : 'Venta'}
        subtitulo='Detalle'
      >
        <LoadMask/>
        <Box sx={{ width: '100%' }}>
          <Box>
            <div className='section'>
              <div className='container_selector'>
                <FormInputText
                  name="id"
                  control={control}
                  label="Numero de venta"
                  disabled
                />
                <FormDate
                  name="date"
                  control={control}
                  label="Fecha"
                  disabled
                />
              </div>

              <FormInputText
                name="name"
                control={control}
                label="Cliente"
                disabled
              />

            </div>

            <div className='section'>
              <FormInputText
                name="address"
                control={control}
                label="Direccion"
                disabled
              />
            </div>

            <div className='section'>
              <FormInputText
                name="paymentType"
                control={control}
                label="Tipo de pago"
                disabled
              />
            </div>
            
          </Box>
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <DataGrid
              rows={adaptedData?.details || []}
              rowCount={adaptedData?.details ? adaptedData?.details.length: 0}
              columns={columns}
              disableColumnSelector
              disableRowSelectionOnClick
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              getRowId={(row: any) => row.id}
              paginationMode="server"
            />
          </Box>
          <br />
          
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <h2>Total: Q {adaptedData?.header.total}</h2>
          </div>
          
          <div className='container_button'>
            <Button
              variant="contained"
              type="button"
              sx={{ mt: 2 }}
              color='error'
              onClick={() => navigate('/private/sale')}
            >
              Regresar
            </Button>

            {idState === 1 && (
              <Button 
                variant="contained"
                type="button"
                sx={{ mt: 2 }}
                color='info'
                onClick={() => dialogOpenSubject$.setSubject = true}
              >
                Confirmar venta
              </Button>
            )}
          </div>
        </Box>
      </CardForm>
    </div>
  )
}

export default BuyShow