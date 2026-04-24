import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Supplier } from "../../models";

import Loading from "@/components/Loading";
import { totalPagesMovile } from "@/utils";
import TableMovil from "../TableMovil/TableMovil";
import { useSupplier } from "../../hooks/useSupplier";
import { editSupplier } from "@/redux/supplierSlice";

const ListOfSuppliers: React.FC = () => {
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
    navigate(`${supplier._id}/editar`);
  };

  const columns: GridColDef[] = [
    {
      field: "_id",
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
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "telefono",
      headerName: "Telefono",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Correo Electronico",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: isMobile ? "block" : "inline" }}>
          {params.value}
        </div>
      ),
    },
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
    },
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
        />
      ) : (
        <DataGrid
          rows={providers}
          rowCount={totalProvieder}
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
          getRowId={(row: any) => row._id}
          paginationMode="server"
        />
      )}
    </div>
  );
};

export default ListOfSuppliers;
