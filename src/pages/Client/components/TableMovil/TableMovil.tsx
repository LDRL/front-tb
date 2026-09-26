import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Client } from '../../models';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface ClientListProps {
    clients: Client[];
    totalClient: number;
    paginationModel: { page: number; pageSize: number };
    handleEditClient: (client: Client) => void;
    handleDeleteClient: (client: Client) => void;
    handleActivateClient: (client: Client) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
    canEdit: boolean;
    canDelete: boolean;
    canActivate: boolean;
}

const TableMovil: React.FC<ClientListProps> = ({
    clients,
    totalClient,
    paginationModel,
    handleEditClient,
    handleDeleteClient,
    handleActivateClient,
    handlePaginationModelChange,
    totalPagesMobile,
    canEdit,
    canDelete,
    canActivate,
}) => {
    return (
        <>
            {clients.map((client) => (
                <Card key={client.id} style={{ marginBottom: '16px' }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3>{client.fullName || client.name}</h3>
                            <p>Código: {client.id}</p>
                            <p>NIT: {client.nit}</p>
                            <p>Teléfono: {client.telefono}</p>
                            <p>Estado: {client.status ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            {((canEdit && client.status) || (canDelete && client.status) || (canActivate && !client.status)) && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {canEdit && client.status && (
                                        <Tooltip title="Editar">
                                            <AppIconButton
                                                color="success"
                                                onClick={() => handleEditClient(client)}
                                            >
                                                <EditIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {canDelete && client.status && (
                                        <Tooltip title="Eliminar">
                                            <AppIconButton
                                                color="error"
                                                onClick={() => handleDeleteClient(client)}
                                            >
                                                <DeleteIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {canActivate && !client.status && (
                                        <Tooltip title="Activar">
                                            <AppIconButton
                                                color="info"
                                                onClick={() => handleActivateClient(client)}
                                            >
                                                <LockOpenIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Pagination
                count={Math.ceil(totalClient / totalPagesMobile)}
                page={paginationModel.page + 1}
                onChange={(_, value) =>
                    handlePaginationModelChange({ page: value - 1, pageSize: paginationModel.pageSize })
                }
                color="primary"
                style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
                siblingCount={0}
                variant="outlined"
            />
        </>
    );
};

export default TableMovil;
