import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import Loading from "@/components/Loading";
import { AppIconButton } from "@/components";
import { totalPagesMovile } from "@/utils";
import TableMovil from "../TableMovil/TableMovil";
import { useActivateSupplier, useSupplier, useDeleteSupplier } from "../../hooks/useSupplier";
import { Supplier } from "../../models/supplier.domain.type";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { PERMISSIONS } from "@/modules/auth/helper/permissions";
import { usePermission } from "@/hooks/usePermission";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/axiosClient";

type SupplierTableProps = {
  onEditSupplier: (supplier: Supplier) => void;
};

const ListOfSuppliers: React.FC<SupplierTableProps> = ({ onEditSupplier }) => {
  const { can } = usePermission();
  const canEdit = can(PERMISSIONS.PROVIDERS.UPDATE);
  const canDelete = can(PERMISSIONS.PROVIDERS.DELETE);
  const canActivate = can(PERMISSIONS.PROVIDERS.UPDATE);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [supplierToActivate, setSupplierToActivate] = useState<Supplier | null>(null);

  const deleteSupplierMutation = useDeleteSupplier();
  const activateSupplierMutation = useActivateSupplier();

  const {
    providers,
    totalProvieder,
    isLoading,
    paginationModel,
    handlePaginationModelChange,
  } = useSupplier();

  const handleConfirmDelete = async () => {
    if (!supplierToDelete || supplierToDelete.code == null) return;

    try {
      await deleteSupplierMutation.mutateAsync(supplierToDelete.code);
      toast.success("Proveedor eliminado exitosamente");
      setSupplierToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleActivate = async () => {
    if (!supplierToActivate) return;

    try {
      await activateSupplierMutation.mutateAsync(supplierToActivate);
      toast.success("Proveedor activado exitosamente");
      setSupplierToActivate(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Codigo",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "address",
      headerName: "Dirección",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "phone",
      headerName: "Telefono",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "mail",
      headerName: "Correo Electronico",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "nit",
      headerName: "Nit",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "state",
      headerName: "Estado",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value ? "Activo" : "Inactivo"}
        </div>
      ),
    },
    ...(canEdit || canDelete
      ? [
          {
            field: "actions",
            type: "actions" as const,
            sortable: false,
            headerName: "Opciones",
            width: 130,
            renderCell: (params: GridRenderCellParams) => {
              const supplier = params.row as Supplier;
              // Real booleans on purpose: a truthy/falsy value like 0 would be
              // rendered as text by React instead of hiding the button.
              const isActive = Boolean(supplier.state);
              const showEdit = canEdit && isActive;
              const showDelete = canDelete && isActive;
              const showActivate = canActivate && !isActive;

              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {showEdit && (
                    <Tooltip title="Editar">
                      <AppIconButton
                        color="success"
                        onClick={() => onEditSupplier(supplier)}
                      >
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {showDelete && (
                    <Tooltip title="Eliminar">
                      <AppIconButton
                        color="error"
                        onClick={() => setSupplierToDelete(supplier)}
                      >
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {showActivate && (
                    <Tooltip title="Activar">
                      <AppIconButton
                        color="info"
                        onClick={() => setSupplierToActivate(supplier)}
                      >
                        <LockOpenIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                </Box>
              );
            },
          } as GridColDef,
        ]
      : []),
  ];

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <div>
      {isMobile ? (
        <TableMovil
          suppliers={providers}
          totalSupplier={totalProvieder}
          paginationModel={paginationModel}
          handleEditSupplier={onEditSupplier}
          handleDeleteSupplier={setSupplierToDelete}
          handleActivateSupplier={setSupplierToActivate}
          handlePaginationModelChange={handlePaginationModelChange}
          totalPagesMobile={totalPagesMovile}
          canEdit={canEdit}
          canDelete={canDelete}
          canActivate={canActivate}
        />
      ) : (
        <DataGrid
          rows={providers}
          rowCount={totalProvieder}
          columns={columns}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0
            ? 'even-row'
            : 'odd-row'
          }
          disableColumnSelector
          disableRowSelectionOnClick
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: paginationModel.pageSize,
                page: paginationModel.page,
              },
            },
          }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[paginationModel.pageSize]}
          getRowId={(row: any) => row.code}
          paginationMode="server"
        />
      )}

      <Dialog
        open={!!supplierToDelete}
        onClose={() => setSupplierToDelete(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Eliminar proveedor"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`¿Estás seguro de que deseas eliminar "${supplierToDelete?.name}"? Esta acción no se puede deshacer.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSupplierToDelete(null)} color="primary">
            Cancelar
          </Button>
          <Button sx={{borderRadius: 5}} onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!supplierToActivate}
        onClose={() => setSupplierToActivate(null)}
        aria-labelledby="activate-supplier-dialog-title"
        aria-describedby="activate-supplier-dialog-description"
      >
        <DialogTitle id="activate-supplier-dialog-title">
          {"Activar proveedor"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="activate-supplier-dialog-description">
            {`¿Estás seguro de que deseas activar el proveedor "${supplierToActivate?.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSupplierToActivate(null)} color="primary">
            Cancelar
          </Button>
          <Button sx={{borderRadius: 5}} onClick={handleActivate} color="primary" variant="contained" autoFocus>
            Activar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListOfSuppliers;