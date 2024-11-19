import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Loading from '@/components/Loading';
import { useBuy } from '../../hooks/useBuy';

const ListOfBuys: React.FC = () => {
    
    const {
        buys,
        totalBuy,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useBuy();


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
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'direction',
            headerName: 'Dirección',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'provider',
            headerName: 'Proveedor',
            flex: 1,
            // renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
            renderCell: (params: GridRenderCellParams) => <>{params.value ? params.value.name : 'Sin Proveedor'}</>,
        },
        /*
        {
            field: 'actions',
            type: 'actions',
            sortable: false,
            headerName: 'Actions',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleEditProduct(params.row as Product)}
                >
                    Edit
                </Button>
            ),
        },*/
    ];

    if (isLoading) {
        return <Loading />;
    }

    return (
        <DataGrid
            rows={buys}
            rowCount={totalBuy}
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

export default ListOfBuys;


