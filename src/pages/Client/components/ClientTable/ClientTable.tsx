import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Client } from "../../models";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Loading from "@/components/Loading";
import { AppIconButton } from "@/components";
import { useActivateClient, useClient, useDeleteClient } from "../../hooks/useClient";
import { totalPagesMovile } from "@/utils";
import TableMovil from "../TableMovil/TableMovil";
import { PERMISSIONS } from "@/modules/auth/helper/permissions";
import { usePermission } from "@/hooks/usePermission";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/axiosClient";

type ClientTableProps = {
    onEditClient: (client: Client) => void;
};

const ClientTable: React.FC<ClientTableProps> = ({ onEditClient }) => {
    const { can } = usePermission();
    const canEdit = can(PERMISSIONS.CLIENTS.UPDATE);
    const canDelete = can(PERMISSIONS.CLIENTS.DELETE);
    const canActivate = can(PERMISSIONS.CLIENTS.UPDATE);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [clientToActivate, setClientToActivate] = useState<Client | null>(null);

    const deleteClientMutation = useDeleteClient();
    const activateClientMutation = useActivateClient();

    const {
        clients,
        totalClient,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useClient();

    const handleConfirmDelete = async () => {
        if (!clientToDelete) return;

        try {
            await deleteClientMutation.mutateAsync(clientToDelete.id);
            toast.success("Cliente eliminado exitosamente");
            setClientToDelete(null);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleActivate = async () => {
        if (!clientToActivate) return;

        try {
            await activateClientMutation.mutateAsync(clientToActivate);
            toast.success("Cliente activado exitosamente");
            setClientToActivate(null);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "Codigo",
            flex: 1,
            minWidth: 80,
        },
        {
            field: "nit",
            headerName: "Nit",
            flex: 1,
            minWidth: 100,
        },
        {
            field: "fullName",
            headerName: "Nombre Completo",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "email",
            headerName: "Correo",
            flex: 1,
            minWidth: 180,
        },
        {
            field: "telefono",
            headerName: "Teléfono",
            flex: 1,
            minWidth: 120,
        },
        {
            field: "status",
            headerName: "Estado",
            flex: 1,
            minWidth: 100,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: isMobile ? "block" : "inline" }}>
                    {params.value ? "Activo" : "Inactivo"}
                </div>
            ),
        },
        ...(canEdit || canDelete
            ? [{
                field: "actions",
                type: "actions" as const,
                sortable: false,
                headerName: "Opciones",
                width: 130,
                renderCell: (params: GridRenderCellParams) => {
                    const client = params.row as Client;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {canEdit && client.status && (
                                <Tooltip title="Editar">
                                    <AppIconButton
                                        color="success"
                                        onClick={() => onEditClient(client)}
                                    >
                                        <EditIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canDelete && client.status && (
                                <Tooltip title="Eliminar">
                                    <AppIconButton
                                        color="error"
                                        onClick={() => setClientToDelete(client)}
                                    >
                                        <DeleteIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
                            {canActivate && !client.status && (
                                <Tooltip title="Activar">
                                    <AppIconButton
                                        color="info"
                                        onClick={() => setClientToActivate(client)}
                                    >
                                        <LockOpenIcon />
                                    </AppIconButton>
                                </Tooltip>
                            )}
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
                    clients={clients}
                    totalClient={totalClient}
                    paginationModel={paginationModel}
                    handleEditClient={onEditClient}
                    handleDeleteClient={setClientToDelete}
                    handleActivateClient={setClientToActivate}
                    handlePaginationModelChange={handlePaginationModelChange}
                    totalPagesMobile={totalPagesMovile}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canActivate={canActivate}
                />
            ) : (
                <DataGrid
                    rows={clients}
                    rowCount={totalClient}
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

            <Dialog
                open={!!clientToDelete}
                onClose={() => setClientToDelete(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Eliminar cliente"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`¿Estás seguro de que deseas eliminar "${clientToDelete?.fullName || clientToDelete?.name}"? Esta acción no se puede deshacer.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClientToDelete(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button sx={{borderRadius: 5}} onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!clientToActivate}
                onClose={() => setClientToActivate(null)}
                aria-labelledby="activate-client-dialog-title"
                aria-describedby="activate-client-dialog-description"
            >
                <DialogTitle id="activate-client-dialog-title">
                    {"Activar cliente"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="activate-client-dialog-description">
                        {`¿Estás seguro de que deseas activar el cliente "${clientToActivate?.fullName || clientToActivate?.name}"?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClientToActivate(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button sx={{borderRadius: 5}} onClick={handleActivate} color="primary" variant="contained" autoFocus>
                        Activar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ClientTable;