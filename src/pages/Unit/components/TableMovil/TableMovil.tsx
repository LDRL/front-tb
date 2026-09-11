import React from 'react';
import { Button, Card, CardContent, Pagination } from '@mui/material';
import { Unit } from '../../models';

interface UnitListProps {
    units: Unit[];
    totalUnit: number;
    paginationModel: { page: number; pageSize: number };
    handleEditUnit: (unit: Unit) => void;
    handleDeleteUnit: (unit: Unit) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
    canEdit: boolean;
    canDelete: boolean;
}

const TableMovil: React.FC<UnitListProps> = ({
    units,
    totalUnit,
    paginationModel,
    handleEditUnit,
    handleDeleteUnit,
    handlePaginationModelChange,
    totalPagesMobile,
    canEdit,
    canDelete,
}) => {
    return (
        <>
            {units.map((unit) => (
                <Card key={unit.id} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <h3>{unit.name}</h3>
                        <p>Abreviatura: {unit.abbreviation}</p>
                        <p>Código: {unit.id}</p>
                        {(canEdit || canDelete) && (
                            <>
                                {canEdit && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleEditUnit(unit)}
                                        sx={{ mr: 1 }}
                                    >
                                        Editar
                                    </Button>
                                )}
                                {canDelete && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteUnit(unit)}
                                    >
                                        Eliminar
                                    </Button>
                                )}
                            </>
                        )}
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