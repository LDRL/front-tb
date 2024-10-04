import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, useMediaQuery,useTheme} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Presentation } from '../../models';

import Loading from '@/components/Loading';
import { totalPagesMovile } from '@/utils';
import TableMovil from '../TableMovil/TableMovil';
import { usePresentation } from '../../hooks/usePresentation';
import { editPresentation } from '@/redux/presentationSlice';

const ListOfPresentations: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        presentations,
        totalPresentation,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = usePresentation();

    const handleEditPresentation = (presentation: Presentation) => {
        dispatch(editPresentation(presentation));
        navigate(`${presentation.id}/editar`)
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
            headerName: 'Presentación',
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
                    onClick={() => handleEditPresentation(params.row as Presentation)}
                >
                    Editar
                </Button>
            ),
        },
    ];


    if (isLoading) {
        return <Loading />;
    }

    return (
        <div style={{paddingRight: isMobile ? "40px": "" }}>
            {isMobile ? (
                <TableMovil
                presentations={presentations}
                    totalPresentation={totalPresentation}
                    paginationModel={paginationModel}
                    handleEditPresentation={handleEditPresentation}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                />
                
            ) : (
                <DataGrid
                    rows={presentations}
                    rowCount={totalPresentation}
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
            )}
        </div>
    );
};

export default ListOfPresentations;