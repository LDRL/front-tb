import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, useMediaQuery,useTheme} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { User } from '../../models';

import Loading from '@/components/Loading';
import { totalPagesMovile } from '@/utils';
import TableMovil from '../TableMovil/TableMovil';
import { useUser } from '../../hooks/useUser';
import { editUser } from '@/redux/userSlice';

const ListOfUsers: React.FC = () => {
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

    const handleEditPresentation = (user: User) => {
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
                    onClick={() => handleEditPresentation(params.row as User)}
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
        <div style={{paddingRight: isMobile ? "40px": "" }}>
            {isMobile ? (
                <TableMovil
                    users={users}
                    totalUser={totalUser}
                    paginationModel={paginationModel}
                    handleEditUser={handleEditPresentation}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                />
                
            ) : (
                <DataGrid
                    rows={users}
                    rowCount={totalUser}
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

export default ListOfUsers;