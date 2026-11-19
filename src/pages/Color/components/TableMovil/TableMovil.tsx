import React from 'react';
import { Box, Card, CardContent, Pagination, Tooltip } from '@mui/material';
import { Color } from '../../models';
import { AppIconButton } from '@/components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface ColorListProps {
  colors: Color[];
  totalColor: number;
  paginationModel: { page: number; pageSize: number };
  handleEditColor: (color: Color) => void;
  handleDeleteColor: (color: Color) => void;
  handleActivateColor: (color: Color) => void;
  handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
  totalPagesMobile: number;
  canEdit: boolean;
  canDelete: boolean;
  canActivate: boolean;
}

const TableMovil: React.FC<ColorListProps> = ({
  colors,
  totalColor,
  paginationModel,
  handleEditColor,
  handleDeleteColor,
  handleActivateColor,
  handlePaginationModelChange,
  totalPagesMobile,
  canEdit,
  canDelete,
  canActivate,
}) => {
  return (
    <>
      {colors.map((color) => (
        <Card key={color.id} style={{ marginBottom: '16px' }}>
          <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    backgroundColor: color.hex || 'transparent',
                  }}
                />
                {color.name}
              </h3>
              <p>Hex: {color.hex}</p>
              <p>Código: {color.id}</p>
              <p>Estado: {color.status ? 'Activo' : 'Inactivo'}</p>
            </div>
            <div>
              {((canEdit && color.status) || (canDelete && color.status) || (canActivate && !color.status)) && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {canEdit && color.status && (
                    <Tooltip title="Editar">
                      <AppIconButton color="success" onClick={() => handleEditColor(color)}>
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canDelete && color.status && (
                    <Tooltip title="Eliminar">
                      <AppIconButton color="error" onClick={() => handleDeleteColor(color)}>
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canActivate && !color.status && (
                    <Tooltip title="Activar">
                      <AppIconButton color="info" onClick={() => handleActivateColor(color)}>
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
        count={Math.ceil(totalColor / totalPagesMobile)}
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
