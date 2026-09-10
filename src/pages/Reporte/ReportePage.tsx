import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { Link } from 'react-router-dom';
import { PrivateRoutes } from '@/models';

const reportes = [
    {
        title: 'Inventario',
        description: 'Stock actual de productos por almacén',
        path: `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REPORTE_INVENTARIO}`,
        icon: <InventoryIcon fontSize="large" color="primary" />,
    },
    {
        title: 'Lotes por vencer',
        description: 'Productos próximos a vencer',
        path: `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.REPORTE_LOTE_X_VENCER}`,
        icon: <EventNoteIcon fontSize="large" color="primary" />,
    },
];

export default function ReportePage() {
    return (
        <div>
            <div>
                <div className="page-title-box">
                    <h4>Reportes</h4>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', margin: '10px', flexWrap: 'wrap' }}>
                {reportes.map((report) => (
                    <Link key={report.path} to={report.path} style={{ textDecoration: 'none' }}>
                        <Card style={{ width: 280 }}>
                            <CardActionArea>
                                <CardContent>
                                    <div style={{ marginBottom: '8px' }}>{report.icon}</div>
                                    <Typography variant="h6">{report.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {report.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}