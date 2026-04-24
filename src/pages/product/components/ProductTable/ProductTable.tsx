export interface ProductTableInterface {
    // open:boolean;
    // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { openModal } from '@/redux/productSlice';
import Loading from '@/components/Loading';

import { useNavigate } from 'react-router-dom';
import { Product } from '../../models/product.domain.type';
import { useGetProducts } from '../../hooks/useProduct';

const urlSinImage = "/sinImagen.png";

const ListOfProducts: React.FC = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        products,
        totalProduct,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useGetProducts();

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
            field: 'image',
            headerName: 'Imagen',
            flex: 1,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const imageUrl = params.value || urlSinImage;

                return (
                <img
                    src={imageUrl}
                    alt="producto"
                    onError={(e: any) => {
                    e.target.src = urlSinImage; // 🔥 fallback si falla la URL
                    }}
                    style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover"                    
                    }}
                />
                );
            },
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
                    Editar
                </Button>
            ),
        },
    ];


    if (isLoading) {
        return <Loading loading={isLoading}/>;
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
            getRowId={(row: any) => row.productCode}
            paginationMode="server"
        />
    );
};

export default ListOfProducts;