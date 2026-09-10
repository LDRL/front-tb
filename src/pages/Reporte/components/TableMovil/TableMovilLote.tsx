import React from 'react';
import { Card, CardContent, Chip } from '@mui/material';
import { EventBusyOutlined } from '@mui/icons-material';
import { LotePorVencer } from '../../models';

interface TableMovilLoteProps {
    lotes: LotePorVencer[];
    urgenciaColor: (urgencia: LotePorVencer['urgencia']) => 'error' | 'warning' | 'info';
    urgenciaLabel: (urgencia: LotePorVencer['urgencia']) => string;
}

const TableMovilLote: React.FC<TableMovilLoteProps> = ({ lotes, urgenciaColor, urgenciaLabel }) => {
    return (
        <>
            {lotes.map((item) => (
                <Card key={item.idLote} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <h3>{item.producto}</h3>
                        <p>Código: {item.codigoProd}</p>
                        <p>Marca: {item.marca}</p>
                        <p>Sucursal: {item.sucursal}</p>
                        <p>Cant. inicial: {item.cantidadInicial}</p>
                        <p>Cant. disponible: {item.cantidadDisponible}</p>
                        <p>Ingreso: {item.fechaIngreso}</p>
                        <p>Vencimiento: {item.fechaVencimiento}</p>
                        <p>Días restantes: {item.diasRestantes}</p>
                        <Chip
                            label={urgenciaLabel(item.urgencia)}
                            color={urgenciaColor(item.urgencia)}
                            size="small"
                            icon={<EventBusyOutlined />}
                        />
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default TableMovilLote;