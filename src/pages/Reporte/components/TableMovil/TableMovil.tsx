import React from 'react';
import { Card, CardContent, Chip } from '@mui/material';
import { Inventory2Outlined } from '@mui/icons-material';
import { Inventario } from '../../models';

interface TableMovilProps {
    inventario: Inventario[];
    estadoColor: (estado: Inventario['estado']) => 'success' | 'warning' | 'error';
    estadoLabel: (estado: Inventario['estado']) => string;
}

const TableMovil: React.FC<TableMovilProps> = ({ inventario, estadoColor, estadoLabel }) => {
    return (
        <>
            {inventario.map((item) => (
                <Card key={item.idAlmacen} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <h3>{item.producto}</h3>
                        <p>Código: {item.codigoProd}</p>
                        <p>Marca: {item.marca}</p>
                        <p>Categoría: {item.categoria}</p>
                        <p>
                            Stock: {item.stock} ({item.stockBase})
                        </p>
                        <p>
                            Desglose:{' '}
                            {item.stockDesglose
                                .map((d) => `${d.presentacion}: ${d.cantidad}`)
                                .join(', ')}
                        </p>
                        <Chip
                            label={estadoLabel(item.estado)}
                            color={estadoColor(item.estado)}
                            size="small"
                            icon={<Inventory2Outlined />}
                        />
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default TableMovil;