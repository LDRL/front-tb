import { Card, CardContent } from '@mui/material';
import { useReporteInventario } from './hooks/useReporte';
import { InventarioTable } from './components';

const summary = (meta: { total: number; normal: number; bajo: number; sin_stock: number }) => [
    { label: 'Total', value: meta.total, color: '#1976d2' },
    { label: 'Normal', value: meta.normal, color: '#2e7d32' },
    { label: 'Bajo', value: meta.bajo, color: '#ed6c02' },
    { label: 'Sin stock', value: meta.sin_stock, color: '#d32f2f' },
];

export default function InventarioPage() {
    const { meta } = useReporteInventario();

    const items = meta ? summary(meta) : [];

    return (
        <div>
            <div>
                <div className="page-title-box" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Reporte de inventario</h4>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', margin: '10px', flexWrap: 'wrap' }}>
                {items.map((item) => (
                    <Card key={item.label} style={{ minWidth: 160 }}>
                        <CardContent>
                            <div style={{ fontSize: '0.9rem', color: item.color, fontWeight: 600 }}>
                                {item.label}
                            </div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                                {item.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div style={{ margin: '10px' }}>
                <InventarioTable />
            </div>
        </div>
    );
}