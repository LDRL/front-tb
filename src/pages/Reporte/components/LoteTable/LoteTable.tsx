import React from 'react';
import { Chip, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Loading from '@/components/Loading';
import { LotePorVencer } from '../../models';
import { useReporteLote } from '../../hooks/useReporte';
import TableMovil from '../TableMovil/TableMovilLote';

export const urgenciaColor = (
    urgencia: LotePorVencer['urgencia']
): 'error' | 'warning' | 'info' => {
    const colors = {
        vencido: 'error',
        critico: 'warning',
        proximo: 'info',
    } as const;

    return colors[urgencia];
};

export const urgenciaLabel = (urgencia: LotePorVencer['urgencia']): string => {
    const labels = {
        vencido: 'Vencido',
        critico: 'Crítico',
        proximo: 'Próximo',
    } as const;

    return labels[urgencia];
};

const LoteTable: React.FC = () => {
    const { lotes, isLoading } = useReporteLote();
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
            field: 'sucursal',
            headerName: 'Sucursal',
            flex: 1,
        },
        {
            field: 'cantidadInicial',
            headerName: 'Cant. inicial',
            flex: 1,
        },
        {
            field: 'cantidadDisponible',
            headerName: 'Cant. disponible',
            flex: 1,
        },
        {
            field: 'fechaIngreso',
            headerName: 'Ingreso',
            flex: 1,
        },
        {
            field: 'fechaVencimiento',
            headerName: 'Vencimiento',
            flex: 1,
        },
        {
            field: 'diasRestantes',
            headerName: 'Días restantes',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div>{params.value}</div>
            ),
        },
        {
            field: 'urgencia',
            headerName: 'Urgencia',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={urgenciaLabel(params.value)}
                    color={urgenciaColor(params.value)}
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
                    lotes={lotes}
                    urgenciaColor={urgenciaColor}
                    urgenciaLabel={urgenciaLabel}
                />
            ) : (
                <DataGrid
                    rows={lotes}
                    columns={columns}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                    }
                    disableColumnSelector
                    disableRowSelectionOnClick
                    autoHeight
                    getRowId={(row: LotePorVencer) => row.idLote}
                />
            )}
        </div>
    );
};

export default LoteTable;