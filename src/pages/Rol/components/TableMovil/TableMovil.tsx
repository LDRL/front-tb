import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Role } from '../../models/role.domain.type';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';

interface RoleListProps {
    roles: Role[];
    totalRole: number;
    paginationModel: { page: number; pageSize: number };
    handleEditRole: (role: Role) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
    canEdit: boolean;
}

const TableMovil: React.FC<RoleListProps> = ({
    roles,
    totalRole,
    paginationModel,
    handleEditRole,
    handlePaginationModelChange,
    totalPagesMobile,
    canEdit,
}) => {
    return (
        <>
            {roles.map((role) => (
                <Card key={role._id} style={{ marginBottom: '16px' }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3>{role.nombrerol}</h3>
                            <p>Código: {role._id}</p>
                        </div>
                        <div>
                            {canEdit && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Editar">
                                        <AppIconButton
                                            color="success"
                                            onClick={() => handleEditRole(role)}
                                        >
                                            <EditIcon />
                                        </AppIconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Pagination
                count={Math.ceil(totalRole / totalPagesMobile)}
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