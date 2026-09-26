import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Tooltip, useMediaQuery,useTheme} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { totalPagesMovile } from '@/utils';
import TableMovil from '../TableMovil/TableMovil';
import { useUser } from '../../hooks/useUser';
import { editUser } from '@/redux/userSlice';
import { User } from '../../models/user.domain.type';
import EditIcon from '@mui/icons-material/Edit';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';

const ListOfUsers: React.FC = () => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.USERS.UPDATE);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        users,
        totalUser,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useUser();

    const handleEditUser = (user: User) => {
        dispatch(editUser(user));
        navigate(`${user._id}/editar`)
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
            field: 'nombre',
            headerName: 'Nombre',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
        },
        {
            field: 'apellido',
            headerName: 'Apellido',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
        },
        {
            field: 'username',
            headerName: 'Usuario',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
        },
        {
            field: 'email',
            headerName: 'Correo Electronico',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? 'block' : 'inline' }}>{params.value}</div>
            ),
        },
        ...(canEdit
            ? [{
                field: 'actions',
                type: 'actions' as const,
                sortable: false,
                headerName: 'Opciones',
                width: 130,
                renderCell: (params: GridRenderCellParams) => {
                    const user = params.row as User;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title="Editar">
                                <AppIconButton
                                    color="success"
                                    onClick={() => handleEditUser(user)}
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
                    users={users}
                    totalUser={totalUser}
                    paginationModel={paginationModel}
                    handleEditUser={handleEditUser}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                />
                
            ) : (
                <DataGrid
                    rows={users}
                    rowCount={totalUser}
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
                    getRowId={(row: any) => row._id}
                    paginationMode="server"
                />
            )}
        </div>
    );
};

export default ListOfUsers;