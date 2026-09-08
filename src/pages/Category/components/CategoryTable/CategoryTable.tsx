import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, useMediaQuery,useTheme} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Category } from '../../models';
import { editCategory } from '@/redux/categorySlice';
import { useCategory } from '../../hooks/useCategory';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';

import Loading from '@/components/Loading';
import { totalPagesMovile } from '@/utils';
import TableMovil from '../TableMovil/TableMovil';

const ListOfCategories: React.FC = () => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.CATEGORIES.UPDATE);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        categories,
        totalCategory,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useCategory();

    const handleEditCategory = (category: Category) => {
        dispatch(editCategory(category));
        navigate(`${category.id}/editar`)
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Codigo',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
        },
        {
            field: 'name',
            headerName: 'Categoría',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
        },
        ...(canEdit
            ? [{
                field: 'actions',
                type: 'actions',
                sortable: false,
                headerName: 'Actions',
                width: 200,
                renderCell: (params: GridRenderCellParams) => (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleEditCategory(params.row as Category)}
                    >
                        Editar
                    </Button>
                ),
            } as GridColDef]
            : []),
    ];


    
    if (isLoading) {
        return <Loading loading={isLoading}/>;
    }

    return (
        <div style={{paddingRight: isMobile ? "40px": "" }}>
            {isMobile ? (
                <TableMovil
                    categories={categories}
                    totalCategory={totalCategory}
                    paginationModel={paginationModel}
                    handleEditCategory={handleEditCategory}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                />
                
            ) : (
                <DataGrid
                    rows={categories}
                    rowCount={totalCategory}
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
                    getRowId={(row: any) => row.id}
                    paginationMode="server"
                />
            )}
        </div>
    );
};

export default ListOfCategories;