import React from 'react';
import { Button, Card, CardContent, Pagination } from '@mui/material';
import { Category } from '../../models';

interface CategoryListProps {
    categories: Category[];
    totalCategory: number;
    paginationModel: { page: number; pageSize: number };
    handleEditCategory: (category: Category) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
}

const TableMovil: React.FC<CategoryListProps> = ({
    categories,
    totalCategory,
    paginationModel,
    handleEditCategory,
    handlePaginationModelChange,
    totalPagesMobile,
}) => {
    return (
        <>
            {categories.map((category) => (
                <Card key={category.id} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <h3>{category.name}</h3>
                        <p>Código: {category.id}</p>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleEditCategory(category)}
                        >
                            Editar
                        </Button>
                    </CardContent>
                </Card>
            ))}
            <Pagination
                count={Math.ceil(totalCategory / totalPagesMobile)}
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
