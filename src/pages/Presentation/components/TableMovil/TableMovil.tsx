import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Presentation } from '../../models';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface PresentationListProps {
    presentations: Presentation[];
    totalPresentation: number;
    paginationModel: { page: number; pageSize: number };
    handleEditPresentation: (presentation: Presentation) => void;
    handleDeletePresentation: (presentation: Presentation) => void;
    handleActivatePresentation: (presentation: Presentation) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
    canEdit: boolean;
    canDelete: boolean;
    canActivate: boolean;
}

const TableMovil: React.FC<PresentationListProps> = ({
    presentations,
    totalPresentation,
    paginationModel,
    handleEditPresentation,
    handleDeletePresentation,
    handleActivatePresentation,
    handlePaginationModelChange,
    totalPagesMobile,
    canEdit,
    canDelete,
    canActivate,
}) => {
    return (
        <>
            {presentations.map((presentation) => (
                <Card key={presentation.id} style={{ marginBottom: '16px' }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <h3>{presentation.name}</h3>
                            <p>Código: {presentation.id}</p>
                            <p>Estado: {presentation.status ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            {((canEdit && presentation.status) || (canDelete && presentation.status) || (canActivate && !presentation.status)) && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {canEdit && presentation.status && (
                                        <Tooltip title="Editar">
                                            <AppIconButton
                                                color="success"
                                                onClick={() => handleEditPresentation(presentation)}
                                            >
                                                <EditIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {canDelete && presentation.status && (
                                        <Tooltip title="Eliminar">
                                            <AppIconButton
                                                color="error"
                                                onClick={() => handleDeletePresentation(presentation)}
                                            >
                                                <DeleteIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {canActivate && !presentation.status && (
                                        <Tooltip title="Activar">
                                            <AppIconButton
                                                color="info"
                                                onClick={() => handleActivatePresentation(presentation)}
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
                count={Math.ceil(totalPresentation / totalPagesMobile)}
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
