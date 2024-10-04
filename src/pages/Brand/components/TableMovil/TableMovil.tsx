import React from 'react';
import { Button, Card, CardContent, Pagination } from '@mui/material';
import { Brand } from '../../models';

interface BrandListProps {
    brands: Brand[];
    totalBrand: number;
    paginationModel: { page: number; pageSize: number };
    handleEditBrand: (category: Brand) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
}

const TableMovil: React.FC<BrandListProps> = ({
    brands,
    totalBrand,
    paginationModel,
    handleEditBrand,
    handlePaginationModelChange,
    totalPagesMobile,
}) => {
    return (
        <>
            {brands.map((brand) => (
                <Card key={brand.id} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <h3>{brand.name}</h3>
                        <p>Código: {brand.id}</p>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleEditBrand(brand)}
                        >
                            Editar
                        </Button>
                    </CardContent>
                </Card>
            ))}
            <Pagination
                count={Math.ceil(totalBrand / totalPagesMobile)}
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
