import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Unit } from '../../models';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface UnitListProps {
    units: Unit[];
    totalUnit: number;
    paginationModel: { page: number; pageSize: number };
    handleEditUnit: (unit: Unit) => void;
    handleDeleteUnit: (unit: Unit) => void;
    handleActivateUnit: (unit: Unit) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
    canEdit: boolean;
    canDelete: boolean;
    canActivate: boolean;
}

const TableMovil: React.FC<UnitListProps> = ({
    units,
    totalUnit,
    paginationModel,
    handleEditUnit,
    handleDeleteUnit,
    handleActivateUnit,
    handlePaginationModelChange,
    totalPagesMobile,
    canEdit,
    canDelete,
    canActivate,
}) => {
    return (
        <>
            {units.map((unit) => (
                <Card key={unit.id} style={{ marginBottom: '16px' }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <h3>{unit.name}</h3>
                            <p>Abreviatura: {unit.abbreviation}</p>
                            <p>Código: {unit.id}</p>
                            <p>Estado: {unit.status ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            {((canEdit && unit.status) || (canDelete && unit.status) || (canActivate && !unit.status)) && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {canEdit && unit.status && (
                                        <Tooltip title="Editar">
                                            <AppIconButton
                                                color="success"
                                                onClick={() => handleEditUnit(unit)}
                                            >
                                                <EditIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {canDelete && unit.status && (
                                        <Tooltip title="Eliminar">
                                            <AppIconButton
                                                color="error"
                                                onClick={() => handleDeleteUnit(unit)}
                                            >
                                                <DeleteIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {canActivate && !unit.status && (
                                        <Tooltip title="Activar">
                                            <AppIconButton
                                                color="info"
                                                onClick={() => handleActivateUnit(unit)}
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
                count={Math.ceil(totalUnit / totalPagesMobile)}
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
