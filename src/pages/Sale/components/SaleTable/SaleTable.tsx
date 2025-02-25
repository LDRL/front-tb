import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Loading from '@/components/Loading';
import {useSale } from '../../hooks/useSale';
import moment from 'moment';

const ListOfSales: React.FC = () => {
    
    const {
        sales,
        totalSale,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useSale();


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Codigo',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'date',
            headerName: 'Fecha',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{moment(params.value).format("DD/MM/YYYY")}</>,
        },
        {
            field: 'client',
            headerName: 'Cliente',
            flex: 1,
            renderCell: (params: GridRenderCellParams) =>  <>{params.value ? `${params.value.name} ${params.value.lastName}` : 'Sin Proveedor'}</>,
        },
        {
            field: 'direction',
            headerName: 'Dirección',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'total',
            headerName: 'Total',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
    ];

    
    if (isLoading) {
        return <Loading loading={isLoading}/>;
    }

    return (
        <DataGrid
            rows={sales}
            rowCount={totalSale}
            columns={columns}
            disableColumnSelector
            disableRowSelectionOnClick
            autoHeight
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: paginationModel.pageSize,
                        page: paginationModel.page,
                    },
                },
            }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[paginationModel.pageSize]}
            getRowId={(row: any) => row.id}
            paginationMode="server"
        />
    );
};

export default ListOfSales;


