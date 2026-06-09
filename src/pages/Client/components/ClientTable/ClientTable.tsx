import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Client } from "../../models";
import Loading from "@/components/Loading";
import { useClient } from "../../hooks/useClient";
import { editClient } from "@/redux/clientSlice";

const ClientTable: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        clients,
        totalClient,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useClient();

    const handleEditClient = (client: Client) => {
        dispatch(editClient(client));
        navigate(`${client.id}/editar`);
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "Codigo",
            flex: 1,
            minWidth: 80,
        },
        {
            field: "nit",
            headerName: "Nit",
            flex: 1,
            minWidth: 100,
        },
        {
            field: "fullName",
            headerName: "Nombre Completo",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "email",
            headerName: "Correo",
            flex: 1,
            minWidth: 180,
        },
        {
            field: "telefono",
            headerName: "Teléfono",
            flex: 1,
            minWidth: 120,
        },
        {
            field: "actions",
            type: "actions",
            sortable: false,
            headerName: "Acciones",
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleEditClient(params.row as Client)}
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
            <DataGrid
                rows={clients}
                rowCount={totalClient}
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
                getRowId={(row: any) => row.id}
                paginationMode="server"
            />
        </div>
    );
};

export default ClientTable;
