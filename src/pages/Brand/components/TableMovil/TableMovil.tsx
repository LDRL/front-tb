import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Brand } from '../../models';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface BrandListProps {
    brands: Brand[];
    totalBrand: number;
    paginationModel: { page: number; pageSize: number };
    handleEditBrand: (brand: Brand) => void;
    handleDeleteBrand: (brand: Brand) => void;
    handleActivateBrand: (brand: Brand) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
    canEdit: boolean;
    canDelete: boolean;
    canActivate: boolean;
}

const TableMovil: React.FC<BrandListProps> = ({
    brands,
    totalBrand,
    paginationModel,
    handleEditBrand,
    handleDeleteBrand,
    handleActivateBrand,
    handlePaginationModelChange,
    totalPagesMobile,
    canEdit,
    canDelete,
    canActivate,
}) => {
    return (
        <>
            {brands.map((brand) => (
                <Card key={brand.id} style={{ marginBottom: '16px' }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <h3>{brand.name}</h3>
                            <p>Código: {brand.id}</p>
                            <p>Estado: {brand.status ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            {((canEdit && brand.status) || (canDelete && brand.status) || (canActivate && !brand.status)) && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {canEdit && brand.status && (
                                        <Tooltip title="Editar">
                                            <AppIconButton
                                                color="success"
                                                onClick={() => handleEditBrand(brand)}
                                            >
                                                <EditIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {canDelete && brand.status && (
                                        <Tooltip title="Eliminar">
                                            <AppIconButton
                                                color="error"
                                                onClick={() => handleDeleteBrand(brand)}
                                            >
                                                <DeleteIcon />
                                            </AppIconButton>
                                        </Tooltip>
                                    )}
                                    {canActivate && !brand.status && (
                                        <Tooltip title="Activar">
                                            <AppIconButton
                                                color="info"
                                                onClick={() => handleActivateBrand(brand)}
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
                count={Math.ceil(totalBrand / totalPagesMobile)}
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
