import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Role } from '../../models/role.domain.type';
import EditIcon from '@mui/icons-material/Edit';
import Loading from '@/components/Loading';
import { AppIconButton } from '@/components';
import { useRole } from '../../hooks/useRole';
import { editRole } from '@/redux/rolSlice';
import { totalPagesMovile } from '@/utils';
import TableMovil from '../TableMovil/TableMovil';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { usePermission } from '@/hooks/usePermission';

const ListOfRoles: React.FC = () => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.ROLES.UPDATE);
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
        ...(canEdit
            ? [{
                field: 'actions',
                type: 'actions' as const,
                sortable: false,
                headerName: 'Opciones',
                width: 130,
                renderCell: (params: GridRenderCellParams) => {
                    const role = params.row as Role;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title="Editar">
                                <AppIconButton
                                    color="success"
                                    onClick={() => handleEditRole(role)}
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
        return <Loading loading={isLoading} />;
    }

    return (
        <div>
            {isMobile ? (
                <TableMovil
                    roles={roles}
                    totalRole={totalRole}
                    paginationModel={paginationModel}
                    handleEditRole={handleEditRole}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                />
            ) : (
                <DataGrid
                    rows={roles}
                    rowCount={totalRole}
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

export default ListOfRoles;
