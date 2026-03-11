import React from 'react';
import { Button, Card, CardContent, Pagination } from '@mui/material';
import { User } from '../../models';

interface BrandListProps {
    users: User[];
    totalUser: number;
    paginationModel: { page: number; pageSize: number };
    handleEditUser: (user: User) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
}

const TableMovil: React.FC<BrandListProps> = ({
    users,
    totalUser,
    paginationModel,
    handleEditUser,
    handlePaginationModelChange,
    totalPagesMobile,
}) => {
    return (
        <>
            {users.map((user) => (
                <Card key={user._id} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <h3>{user.nombre}</h3>
                        <p>Código: {user._id}</p>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleEditUser(user)}
                        >
                            Editar
                        </Button>
                    </CardContent>
                </Card>
            ))}
            <Pagination
                count={Math.ceil(totalUser / totalPagesMobile)}
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
