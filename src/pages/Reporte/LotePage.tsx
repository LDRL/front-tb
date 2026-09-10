import { Card, CardContent } from '@mui/material';
import { useReporteLote } from './hooks/useReporte';
import { LoteTable } from './components';

const summary = (meta: { total: number; vencido: number; critico: number; proximo: number; dias: number }) => [
    { label: 'Total', value: meta.total, color: '#1976d2' },
    { label: 'Vencidos', value: meta.vencido, color: '#d32f2f' },
    { label: 'Críticos', value: meta.critico, color: '#ed6c02' },
    { label: 'Próximos', value: meta.proximo, color: '#0288d1' },
    { label: 'Ventana (días)', value: meta.dias, color: '#757575' },
];

export default function LotePage() {
    const { meta } = useReporteLote();

    const items = meta ? summary(meta) : [];

    return (
        <div>
            <div>
                <div className="page-title-box" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Lotes por vencer</h4>
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
                <LoteTable />
            </div>
        </div>
    );
}