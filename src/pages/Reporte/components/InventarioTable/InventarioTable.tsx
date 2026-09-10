import React from 'react';
import { Box, Chip, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Loading from '@/components/Loading';
import { Inventario } from '../../models';
import { useReporteInventario } from '../../hooks/useReporte';
import TableMovil from '../TableMovil/TableMovil';

export const estadoColor = (estado: Inventario['estado']): 'success' | 'warning' | 'error' => {
    const colors = {
        normal: 'success',
        bajo: 'warning',
        sin_stock: 'error',
    } as const;

    return colors[estado];
};

export const estadoLabel = (estado: Inventario['estado']): string => {
    const labels = {
        normal: 'Normal',
        bajo: 'Bajo',
        sin_stock: 'Sin stock',
    } as const;

    return labels[estado];
};

const InventarioTable: React.FC = () => {
    const { inventario, isLoading } = useReporteInventario();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const columns: GridColDef[] = [
        {
            field: 'codigoProd',
            headerName: 'Código',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'producto',
            headerName: 'Producto',
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'marca',
            headerName: 'Marca',
            flex: 1,
        },
        {
            field: 'categoria',
            headerName: 'Categoría',
            flex: 1,
        },
        {
            field: 'unidad',
            headerName: 'Unidad',
            flex: 1,
        },
        /*{
            field: 'presentaciones',
            headerName: 'Presentaciones',
            flex: 1.5,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <div>{params.value.map((p: { nombre: string }) => p.nombre).join(', ')}</div>
            ),
        },*/
        /*{
            field: 'stock',
            headerName: 'Stock',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div>
                    {params.value} ({params.row.stockBase})
                </div>
            ),
        },*/
        {
            field: 'stockDesglose',
            headerName: 'Stock Actual',
            flex: 1.5,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => {
                let restante = params.row.stock;
                return (
                    <Box sx={{ width: '100%' }}>
                        { params.value.map(
                        (
                            d: { presentacion: string; cantidad: number; cantidadBase: number; },
                            index: number
                        ) => {
                            const cantidad = Math.floor(
                                restante / d.cantidadBase
                            );

                            restante = restante % d.cantidadBase;
                            const unidad = cantidad * d.cantidadBase;
                            return (
                                <Box key={index}>
                                    <Box sx={{ py: 0.5 }}>
                                        <strong>{unidad}</strong>{' '} 

                                        {d.cantidadBase == 1 && (
                                            <>
                                                {d.presentacion} 
                                                {cantidad > 1 ? 's' : ''}
                                            </>
                                        )}

                                        {d.cantidadBase > 1 && (
                                            <>
                                                {params.row.stockBase}
                                                {cantidad > 1 ? 's' : ''}
                                                {' '}
                                                (
                                                    <strong>{cantidad}</strong>{' '}
                                                    {d.presentacion}
                                                    {cantidad > 1 ? 's' : ''}
                                                )
                                            </>
                                        )}
                                    </Box>

                                    {index < params.value.length - 1 && (
                                        <Box
                                            sx={{
                                                borderBottom: '1px solid #ddd',
                                            }}
                                        />
                                    )}
                                </Box>
                            )
                        } 
                        )}
                    </Box>
                )   
            },
        },
        {
            field: 'stockMinimo',
            headerName: 'Stock mínimo',
            flex: 1,
        },
        {
            field: 'estado',
            headerName: 'Estado',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={estadoLabel(params.value)}
                    color={estadoColor(params.value)}
                    size="small"
                />
            ),
        },
    ];

    if (isLoading) {
        return <Loading loading={isLoading} />;
    }

    return (
        <div style={{ paddingRight: isMobile ? '40px' : '' }}>
            {isMobile ? (
                <TableMovil
                    inventario={inventario}
                    estadoColor={estadoColor}
                    estadoLabel={estadoLabel}
                />
            ) : (
                <DataGrid
                    rows={inventario}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    columns={columns}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                    }
                    disableColumnSelector
                    disableRowSelectionOnClick
                    autoHeight
                    getRowId={(row: Inventario) => row.idAlmacen}
                    getRowHeight={() => 'auto'}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    }}
                />
            )}
        </div>
    );
};

export default InventarioTable;