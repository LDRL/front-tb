import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Loading from '@/components/Loading';
import { useBuy } from '../../hooks/useBuy';
import { Button } from '@mui/material';
import { Buy } from '../../models';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// import { useDispatch } from 'react-redux';

const ListOfBuys: React.FC = () => {

    // const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const {
        buys,
        totalBuy,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useBuy();

    const handleShowBuy = (buy: Buy) => {
        // dispatch(editCategory(category));
        navigate(`${buy.id}/show`)
    };


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
        {
            field: 'total',
            headerName: 'Total',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        
        {
            field: 'actions',
            type: 'actions',
            sortable: false,
            headerName: '',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleShowBuy(params.row as Buy)}
                >
                    Detalle
                </Button>
            ),
        },
    ];

    
    if (isLoading) {
        return <Loading loading={isLoading}/>;
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


