import React from 'react';
import { Button, Card, CardContent, Pagination } from '@mui/material';
import { Supplier } from '../../models';

interface SupplierListProps {
    suppliers: Supplier[];
    totalSupplier: number;
    paginationModel: { page: number; pageSize: number };
    handleEditSupplier: (supplier: Supplier) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
}

const TableMovil: React.FC<SupplierListProps> = ({
    suppliers,
    totalSupplier,
    paginationModel,
    handleEditSupplier,
    handlePaginationModelChange,
    totalPagesMobile,
}) => {
    return (
        <>
            {suppliers.map((supplier) => (
                <Card key={supplier._id} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <h3>{supplier.nombre}</h3>
                        <p>Código: {supplier._id}</p>
                        <p>Direccion: {supplier.direccion}</p>
                        <p>Telefonos: {supplier.telefono}</p>
                        <p>Correo Electronico: {supplier.email}</p>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleEditSupplier(supplier)}
                        >
                            Editar
                        </Button>
                    </CardContent>
                </Card>
            ))}
            <Pagination
                count={Math.ceil(totalSupplier / totalPagesMobile)}
                page={paginationModel.page + 1}
                onChange={(event, value) =>
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