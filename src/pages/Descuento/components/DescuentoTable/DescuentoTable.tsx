import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppIconButton } from "@/components";
import Loading from "@/components/Loading";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/modules/auth/helper/permissions";
import { PrivateRoutes } from "@/models";
import { getErrorMessage } from "@/utils/axiosClient";
import { Descuento } from "../../models";
import { useDeleteDescuento, useDescuento, useUpdateDescuento } from "../../hooks/useDescuento";

const formatValue = (row: Descuento) =>
  row.type === "porcentaje" ? `${Number(row.value).toFixed(2)}%` : `Q ${Number(row.value).toFixed(2)}`;

const formatDateRange = (row: Descuento) => {
  const ini = row.startDate ? dayjs(row.startDate).format("DD/MM/YYYY") : "—";
  const fin = row.endDate ? dayjs(row.endDate).format("DD/MM/YYYY") : "—";
  return `${ini} - ${fin}`;
};

const DescuentoTable: React.FC = () => {
  const navigate = useNavigate();
  const { can } = usePermission();
  const canEdit = can(PERMISSIONS.DESCUENTOS.UPDATE);
  const canDelete = can(PERMISSIONS.DESCUENTOS.DELETE);

  const [toDelete, setToDelete] = useState<Descuento | null>(null);
  const [toActivate, setToActivate] = useState<Descuento | null>(null);

  const { descuentos, total, isLoading, paginationModel, handlePaginationModelChange } = useDescuento();
  const deleteMutation = useDeleteDescuento();
  const updateMutation = useUpdateDescuento();

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      toast.success("Descuento eliminado exitosamente");
      setToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleActivate = async () => {
    if (!toActivate) return;
    try {
      await updateMutation.mutateAsync({
        id: toActivate.id,
        productPresentationId: toActivate.productPresentationId,
        type: toActivate.type,
        value: toActivate.value,
        startDate: toActivate.startDate ? dayjs(toActivate.startDate) : null,
        endDate: toActivate.endDate ? dayjs(toActivate.endDate) : null,
        minimum: toActivate.minimum ?? "",
        status: true,
      });
      toast.success("Descuento activado exitosamente");
      setToActivate(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const columns: GridColDef[] = [
    {
      field: "product",
      headerName: "Producto / Presentación",
      flex: 1.4,
      minWidth: 260,
      renderCell: (params: GridRenderCellParams<Descuento>) => {
        const row = params.row;
        const name = [row.productName, row.presentationName].filter(Boolean).join(" - ");
        return <span>{name || `Presentación #${row.productPresentationId}`}</span>;
      },
    },
    {
      field: "type",
      headerName: "Tipo",
      flex: 0.7,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<Descuento>) =>
        params.row.type === "porcentaje" ? "Porcentaje" : "Monto fijo",
    },
    {
      field: "value",
      headerName: "Valor",
      flex: 0.6,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<Descuento>) => formatValue(params.row),
    },
    {
      field: "minimum",
      headerName: "Mínimo",
      flex: 0.5,
      minWidth: 90,
      renderCell: (params: GridRenderCellParams<Descuento>) => params.row.minimum ?? "—",
    },
    {
      field: "vigencia",
      headerName: "Vigencia",
      flex: 1,
      minWidth: 190,
      renderCell: (params: GridRenderCellParams<Descuento>) => formatDateRange(params.row),
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 0.5,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<Descuento>) => (
        <Chip
          size="small"
          label={params.row.status ? "Activo" : "Inactivo"}
          color={params.row.status ? "success" : "default"}
        />
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
            renderCell: (params: GridRenderCellParams<Descuento>) => {
              const row = params.row;
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {canEdit && row.status && (
                    <Tooltip title="Editar">
                      <AppIconButton
                        color="success"
                        onClick={() =>
                          navigate(`/private/${PrivateRoutes.DESCUENTO_EDIT.replace(":id", String(row.id))}`)
                        }
                      >
                        <EditIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canDelete && row.status && (
                    <Tooltip title="Eliminar">
                      <AppIconButton color="error" onClick={() => setToDelete(row)}>
                        <DeleteIcon />
                      </AppIconButton>
                    </Tooltip>
                  )}
                  {canEdit && !row.status && (
                    <Tooltip title="Activar">
                      <AppIconButton color="info" onClick={() => setToActivate(row)}>
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

  if (isLoading) return <Loading loading />;

  return (
    <div>
      <DataGrid
        rows={descuentos}
        rowCount={total}
        columns={columns}
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
        getRowId={(row: Descuento) => row.id}
        paginationMode="server"
      />

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Eliminar descuento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este descuento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancelar</Button>
          <Button sx={{ borderRadius: 5 }} color="error" variant="contained" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!toActivate} onClose={() => setToActivate(null)}>
        <DialogTitle>Activar descuento</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Deseas activar este descuento?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToActivate(null)}>Cancelar</Button>
          <Button sx={{ borderRadius: 5 }} variant="contained" onClick={handleActivate}>
            Activar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DescuentoTable;
