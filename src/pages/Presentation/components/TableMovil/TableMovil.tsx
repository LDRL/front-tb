import React from 'react';
import { Button, Card, CardContent, Pagination } from '@mui/material';
import { Presentation } from '../../models';

interface BrandListProps {
    presentations: Presentation[];
    totalPresentation: number;
    paginationModel: { page: number; pageSize: number };
    handleEditPresentation: (presentation: Presentation) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
}

const TableMovil: React.FC<BrandListProps> = ({
    presentations,
    totalPresentation,
    paginationModel,
    handleEditPresentation,
    handlePaginationModelChange,
    totalPagesMobile,
}) => {
    return (
        <>
            {presentations.map((presentation) => (
                <Card key={presentation.id} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <h3>{presentation.name}</h3>
                        <p>Código: {presentation.id}</p>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleEditPresentation(presentation)}
                        >
                            Editar
                        </Button>
                    </CardContent>
                </Card>
            ))}
            <Pagination
                count={Math.ceil(totalPresentation / totalPagesMobile)}
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
