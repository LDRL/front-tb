import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Supplier } from '../../models/supplier.domain.type';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface SupplierListProps {
    suppliers: Supplier[];
    totalSupplier: number;
    paginationModel: { page: number; pageSize: number };
    handleEditSupplier: (supplier: Supplier) => void;
    handleDeleteSupplier: (supplier: Supplier) => void;
    handleActivateSupplier: (supplier: Supplier) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
    canEdit: boolean;
    canDelete: boolean;
    canActivate: boolean;
}

const TableMovil: React.FC<SupplierListProps> = ({
    suppliers,
    totalSupplier,
    paginationModel,
    handleEditSupplier,
    handleDeleteSupplier,
    handleActivateSupplier,
    handlePaginationModelChange,
    totalPagesMobile,
    canEdit,
    canDelete,
    canActivate,
}) => {
    return (
        <>
            {suppliers.map((supplier) => {
                // Kept as real booleans on purpose: a truthy/falsy value like 0
                // would be rendered as text by React instead of hiding the button.
                const isActive = Boolean(supplier.state);
                const showEdit = canEdit && isActive;
                const showDelete = canDelete && isActive;
                const showActivate = canActivate && !isActive;

                return (
                <Card key={supplier.code} style={{ marginBottom: '16px' }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <h3>{supplier.name}</h3>
                            <p>Código: {supplier.code}</p>
                            <p>Direccion: {supplier.address}</p>
                            <p>Telefonos: {supplier.phone}</p>
                            <p>Correo Electronico: {supplier.mail}</p>
                            <p>Estado: {isActive ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            {(showEdit || showDelete || showActivate) && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {showEdit && (
                                        <Tooltip title="Editar">
                                            <AppIconButton
                                                color="success"
                                                onClick={() => handleEditSupplier(supplier)}
                                            >
                                                <EditIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {showDelete && (
                                        <Tooltip title="Eliminar">
                                            <AppIconButton
                                                color="error"
                                                onClick={() => handleDeleteSupplier(supplier)}
                                            >
                                                <DeleteIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {showActivate && (
                                        <Tooltip title="Activar">
                                            <AppIconButton
                                                color="info"
                                                onClick={() => handleActivateSupplier(supplier)}
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
                );
            })}
            <Pagination
                count={Math.ceil(totalSupplier / totalPagesMobile)}
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
