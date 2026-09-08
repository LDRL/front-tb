import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import Loading from "@/components/Loading";
import { totalPagesMovile } from "@/utils";
import TableMovil from "../TableMovil/TableMovil";
import { useSupplier } from "../../hooks/useSupplier";
import { editSupplier } from "@/redux/supplierSlice";
import { Supplier } from "../../models/supplier.domain.type";
import { PERMISSIONS } from "@/modules/auth/helper/permissions";
import { usePermission } from "@/hooks/usePermission";

const ListOfSuppliers: React.FC = () => {
  const { can } = usePermission();
  const canEdit = can(PERMISSIONS.PROVIDERS.UPDATE);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    providers,
    totalProvieder,
    isLoading,
    paginationModel,
    handlePaginationModelChange,
  } = useSupplier();

  const handleEditPresentation = (supplier: Supplier) => {
    dispatch(editSupplier(supplier));
    navigate(`${supplier.code}/editar`);
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
    ...(canEdit
      ? [
          {
            field: "actions",
            type: "actions",
            sortable: false,
            headerName: "Actions",
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
              <Button
                variant="contained"
                color="success"
                onClick={() => handleEditPresentation(params.row as Supplier)}
              >
                Editar
              </Button>
            ),
          } as GridColDef,
        ]
      : []),
  ];

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <div style={{ paddingRight: isMobile ? "40px" : "" }}>
      {isMobile ? (
        <TableMovil
          suppliers={providers}
          totalSupplier={totalProvieder}
          paginationModel={paginationModel}
handleEditSupplier={handleEditPresentation}
        handlePaginationModelChange={handlePaginationModelChange}
        totalPagesMobile={totalPagesMovile}
        canEdit={canEdit}
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
    </div>
  );
};

export default ListOfSuppliers;
