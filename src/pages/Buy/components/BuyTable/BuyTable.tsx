import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Loading from '@/components/Loading';
import { useAnnulBuy, useBuy } from '../../hooks/useBuy';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Buy } from '../../models/buy.domain.type';
import { getErrorMessage } from '@/utils/axiosClient';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';
import { AppIconButton } from '@/components';
import { useSesionActual } from '@/pages/Caja/hooks/useCaja';

// import { useDispatch } from 'react-redux';

const ListOfBuys: React.FC = () => {

    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const { can } = usePermission();
    const canAnnul = can(PERMISSIONS.PURCHASES.DELETE);
    const annulMutation = useAnnulBuy();
    const { data: sesionActual } = useSesionActual();
    const [buyToAnnul, setBuyToAnnul] = useState<Buy | null>(null);
    
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

    const handleConfirmAnnul = async () => {
        if (!buyToAnnul) return;
        try {
            const data = await annulMutation.mutateAsync({
                id: buyToAnnul.id,
                idcaja: sesionActual?.status === 'ABIERTA' ? sesionActual.cajaId : undefined,
            });
            if (data?.advertencias?.length) {
                toast.warning('Compra anulada con advertencias. Revise el stock de los productos afectados.');
            } else {
                toast.success('Compra anulada exitosamente');
            }
            setBuyToAnnul(null);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
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
            field: 'address',
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
            renderCell: (params: GridRenderCellParams) => <>Q {Number(params.value).toFixed(2)}</>,
        },
        {
            field: 'state',
            headerName: 'Estado',
            flex: 0.7,
            minWidth: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    size="small"
                    label={params.row.state ? 'Activa' : 'Anulada'}
                    color={params.row.state ? 'success' : 'default'}
                    variant={params.row.state ? 'filled' : 'outlined'}
                />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            sortable: false,
            headerName: 'Acciones',
            width: 140,
            renderCell: (params: GridRenderCellParams) => {
                const buy = params.row as Buy;
                const canAnnulThis = canAnnul && !!buy.state;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Detalle">
                            <AppIconButton
                                color="info"
                                onClick={() => handleShowBuy(buy)}
                            >
                                <VisibilityIcon />
                            </AppIconButton>
                        </Tooltip>
                        {canAnnul && (
                            <Tooltip title={buy.state ? 'Anular compra' : 'Compra ya anulada'}>
                                <span>
                                    <AppIconButton
                                        color="error"
                                        disabled={!canAnnulThis || annulMutation.isPending}
                                        onClick={() => setBuyToAnnul(buy)}
                                    >
                                        <BlockIcon />
                                    </AppIconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                );
            },
        },
    ];

    if (isLoading) {
        return <Loading loading={isLoading}/>;
    }

    return (
        <>
            <DataGrid
                rows={buys}
                rowCount={totalBuy}
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

            <Dialog
                open={!!buyToAnnul}
                onClose={() => !annulMutation.isPending && setBuyToAnnul(null)}
            >
                <DialogTitle>Anular compra</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Seguro que querés anular la compra <strong>{buyToAnnul?.id}</strong>?
                        Esta acción revertirá el stock asociado y no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setBuyToAnnul(null)}
                        disabled={annulMutation.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmAnnul}
                        disabled={annulMutation.isPending}
                    >
                        {annulMutation.isPending ? 'Anulando...' : 'Anular'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListOfBuys;