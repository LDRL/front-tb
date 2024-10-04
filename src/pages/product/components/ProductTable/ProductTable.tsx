export interface ProductTableInterface {
    // open:boolean;
    // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Product } from '../../models';
import { openModal } from '@/redux/productSlice';
// import { dialogOpenSubject$ } from '@/components/CustomDialog/CustomDialog';
import Loading from '@/components/Loading';
import { useProducts } from '@/hooks/useProduct';

import { useNavigate } from 'react-router-dom';

const ListOfProducts: React.FC = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        products,
        totalProduct,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useProducts();

    const handleEditProduct = (product: Product) => {
        dispatch(openModal(product));
        navigate(`${product.productCode}/editar`)
    };

    const columns: GridColDef[] = [
        {
            field: 'productCode',
            headerName: 'Codigo',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'name',
            headerName: 'Producto',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'price',
            headerName: 'Precio',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'brand',
            headerName: 'Marca',
            flex: 1,
            // renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
            renderCell: (params: GridRenderCellParams) => <>{params.value ? params.value.name : 'Sin marca'}</>,
        },
        {
            field: 'presentation',
            headerName: 'Presentacion',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value ? params.value.name : 'Sin Presentacion'}</>,
        },
        {
            field: 'category',
            headerName: 'Categoria',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value ? params.value.name : 'Sin Categoria'}</>,
        },
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
        },
    ];

    if (isLoading) {
        return <Loading />;
    }

    return (
        <DataGrid
            rows={products}
            rowCount={totalProduct}
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

export default ListOfProducts;


/*
const NoProductsResults: React.FC = () => {
    return(
        <p>No se encontraron productos para esta busqueda</p>
    )
}


const ProductTable: React.FC = ({products}) => {
    const hasProducts = products?.length > 0

    return(
        hasProducts 
            ? <ListOfProducts />
            : <NoProductsResults/>    
        )
}
*/

