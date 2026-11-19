import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Publico } from '../../models';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface PublicoListProps {
  publicos: Publico[];
  totalPublico: number;
  paginationModel: { page: number; pageSize: number };
  handleEditPublico: (publico: Publico) => void;
  handleDeletePublico: (publico: Publico) => void;
  handleActivatePublico: (publico: Publico) => void;
  handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
  totalPagesMobile: number;
  canEdit: boolean;
  canDelete: boolean;
  canActivate: boolean;
}

const TableMovil: React.FC<PublicoListProps> = ({
  publicos,
  totalPublico,
  paginationModel,
  handleEditPublico,
  handleDeletePublico,
  handleActivatePublico,
  handlePaginationModelChange,
  totalPagesMobile,
  canEdit,
  canDelete,
  canActivate,
}) => {
  return (
    <>
      {publicos.map((publico) => (
        <Card key={publico.id} style={{ marginBottom: '16px' }}>
          <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3>{publico.name}</h3>
              <p>Código: {publico.id}</p>
              <p>Estado: {publico.status ? 'Activo' : 'Inactivo'}</p>
            </div>
            <div>
              {((canEdit && publico.status) || (canDelete && publico.status) || (canActivate && !publico.status)) && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {canEdit && publico.status && (
                    <Tooltip title="Editar">
                      <AppIconButton color="success" onClick={() => handleEditPublico(publico)}>
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canDelete && publico.status && (
                    <Tooltip title="Eliminar">
                      <AppIconButton color="error" onClick={() => handleDeletePublico(publico)}>
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canActivate && !publico.status && (
                    <Tooltip title="Activar">
                      <AppIconButton color="info" onClick={() => handleActivatePublico(publico)}>
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
        count={Math.ceil(totalPublico / totalPagesMobile)}
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
