import { Form, useNavigate, useParams } from "react-router-dom";
import { useShowBuy } from "../../hooks/useBuy";
import { CSSProperties, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import LoadMask from "@/components/LoadMask/LoadMask";
import { Box, Button } from "@mui/material";
import CardForm from "@/components/Cards/CardForm";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { HeaderBuyAdapter } from "../../adapter";
import { FormDate, FormInputNumber, FormInputText } from "@/components";
import { HeaderH } from "../../models";
import { useForm } from 'react-hook-form';
import dayjs from "dayjs";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
}

function BuyShow() {
  const navigate = useNavigate();
  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const { data, isLoading, isError } = id ? useShowBuy(id) : { data: null, isLoading: false, isError: false };
  const adaptedData = data ? HeaderBuyAdapter(data.compra):null;

  const { control, reset, getValues, setValue} = useForm<HeaderH>({
    defaultValues: { _id: 0, date: dayjs(), direction: '', provedorId: 0, proveedorName: '' }
  });
  
  const [color] = useState("#ffffff")

  const columns: GridColDef[] = [
    {
        field: '_id',
        headerName: 'Codigo',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    },
    {
        field: 'amount',
        headerName: 'Cantidad',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    },
    {
        field: 'cost',
        headerName: 'Precio',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    },
    {
        field: 'product',
        headerName: 'Producto',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    }
  ];

  useEffect(() => {
    if (adaptedData?.header._id) {
      reset(adaptedData.header);
    }
  }, [adaptedData?.header._id]);
  
  if (isError) {
    return (
      <div className="container">
        <h2>Error al cargar los datos de la compra.</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <h2>No se encontraron datos de la compra.</h2>
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

      <CardForm
        titulo='Compra'
        subtitulo='Detalle'
      >
        <LoadMask/>
        <Box
        >
          <Box>
          <div className='section'>
          <div className='container_selector'>
              <FormInputText
                name="_id"
                control={control}
                label="Numero de compra"
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
              name="proveedorName"
              control={control}
              label="Proveedor"
              disabled
            />

            </div>

            <div className='section'>
            <FormInputText
              name="direction"
              control={control}
              label="Direccion"
              disabled
            />
            </div>

            
            
          </Box>
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
              getRowId={(row: any) => row._id}
              paginationMode="server"
          />

          <div className='container_button'>
            <Button
              variant="contained"
              type="button"
              sx={{ mt: 2 }}
              color='error'
              onClick={() => navigate('/private/buy')}
            >
              Regresar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  )
}

export default BuyShow