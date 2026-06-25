import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Role } from '../../models/role.domain.type';
import Loading from '@/components/Loading';
import { useRole } from '../../hooks/useRole';
import { editRole } from '@/redux/rolSlice';

const ListOfRoles: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        roles,
        totalRole,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useRole();

    const handleEditRole = (role: Role) => {
        dispatch(editRole(role));
        navigate(`${role._id}/editar`);
    };

    const columns: GridColDef[] = [
        {
            field: '_id',
            headerName: 'Codigo',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
        },
        {
            field: 'nombrerol',
            headerName: 'Nombre del Rol',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
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
                    onClick={() => handleEditRole(params.row as Role)}
                >
                    Editar
                </Button>
            ),
        },
    ];

    if (isLoading) {
        return <Loading loading={isLoading} />;
    }

    return (
        <div style={{ paddingRight: isMobile ? '40px' : '' }}>
            {isMobile ? (
                <div>Mobile view not implemented for roles</div>
            ) : (
                <DataGrid
                    rows={roles}
                    rowCount={totalRole}
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
                    getRowId={(row: any) => row._id}
                    paginationMode="server"
                />
            )}
        </div>
    );
};

export default ListOfRoles;
