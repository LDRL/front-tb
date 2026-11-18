import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Talla } from '../../models';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface TallaListProps {
  tallas: Talla[];
  totalTalla: number;
  paginationModel: { page: number; pageSize: number };
  handleEditTalla: (talla: Talla) => void;
  handleDeleteTalla: (talla: Talla) => void;
  handleActivateTalla: (talla: Talla) => void;
  handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
  totalPagesMobile: number;
  canEdit: boolean;
  canDelete: boolean;
  canActivate: boolean;
}

const TableMovil: React.FC<TallaListProps> = ({
  tallas,
  totalTalla,
  paginationModel,
  handleEditTalla,
  handleDeleteTalla,
  handleActivateTalla,
  handlePaginationModelChange,
  totalPagesMobile,
  canEdit,
  canDelete,
  canActivate,
}) => {
  return (
    <>
      {tallas.map((talla) => (
        <Card key={talla.id} style={{ marginBottom: '16px' }}>
          <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3>{talla.name}</h3>
              <p>Tipo: {talla.type}</p>
              <p>Orden: {talla.order}</p>
              <p>Código: {talla.id}</p>
              <p>Estado: {talla.status ? 'Activo' : 'Inactivo'}</p>
            </div>
            <div>
              {((canEdit && talla.status) || (canDelete && talla.status) || (canActivate && !talla.status)) && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {canEdit && talla.status && (
                    <Tooltip title="Editar">
                      <AppIconButton color="success" onClick={() => handleEditTalla(talla)}>
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canDelete && talla.status && (
                    <Tooltip title="Eliminar">
                      <AppIconButton color="error" onClick={() => handleDeleteTalla(talla)}>
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canActivate && !talla.status && (
                    <Tooltip title="Activar">
                      <AppIconButton color="info" onClick={() => handleActivateTalla(talla)}>
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
        count={Math.ceil(totalTalla / totalPagesMobile)}
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
