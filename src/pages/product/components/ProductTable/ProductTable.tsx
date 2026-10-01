import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { openModal } from '@/redux/productSlice';
import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';

import { useNavigate } from 'react-router-dom';
import { Detail, Product } from '../../models/product.domain.type';
import { useGetProducts } from '../../hooks/useProduct';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';
import { usePresentationName } from '../../hooks/usePresentationName';
import { totalPagesMovile } from '@/utils';
import TableMovil from '../TableMovil/TableMovil';

const urlSinImage = "/sinImagen.png";

const ListOfProducts: React.FC = () => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.PRODUCTS.UPDATE);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    
    const {
        products,
        totalProduct,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useGetProducts();

    // The product list does not always carry the presentation name, so the
    // catalog is used to resolve it from the id. Cached 5 min by react-query.
    const resolvePresentationName = usePresentationName();

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
            field: 'brand',
            headerName: 'Marca',
            flex: 1,
            // renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
            renderCell: (params: GridRenderCellParams) => <>{params.value ? params.value.name : 'Sin marca'}</>,
        },
        {
            field: 'presentacions',
            headerName: 'Presentacion',
            flex: 1,
            minWidth: 160,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const detalles = params.value as Detail[] | undefined;

                if (!detalles?.length) {
                    return <Typography variant="body2">Sin Presentacion</Typography>;
                }

                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            py: 0.5,
                        }}
                    >
                        {detalles.map((detalle, index) => (
                            <Typography
                                key={`${detalle.idPresentation}-${index}`}
                                variant="body2"
                                sx={{ lineHeight: 1.4 }}
                            >
                                {resolvePresentationName(detalle)}
                            </Typography>
                        ))}
                    </Box>
                );
            },
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
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = urlSinImage; // 🔥 fallback si falla la URL
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
        ...(canEdit
            ? [{
                field: 'actions',
                type: 'actions' as const,
                sortable: false,
                headerName: 'Opciones',
                width: 130,
                renderCell: (params: GridRenderCellParams) => {
                    const product = params.row;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title="Editar">
                                <AppIconButton
                                    color="success"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    <EditIcon />
                                </AppIconButton>
                            </Tooltip>
                        </Box>
                    );
                },
            } as GridColDef]
            : []),
    ];


    if (isLoading) {
        return <Loading loading={isLoading}/>;
    }

    return (

        <div>
            {isMobile ? (
                <TableMovil
                    products={products}
                    totalProduct={totalProduct}
                    paginationModel={paginationModel}
                    handleEditProduct={handleEditProduct}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                />
                
            ) : (

            <DataGrid<Product>
                rows={products}
                rowCount={totalProduct}
                columns={columns}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0
                    ? 'even-row'
                    : 'odd-row'
                }
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
                getRowId={(row) => row.productCode}
                paginationMode="server"
            />
            )}
        </div>
    );
};

export default ListOfProducts;