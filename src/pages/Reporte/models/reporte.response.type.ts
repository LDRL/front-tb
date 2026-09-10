import { ApiInventario } from "./reporte.api.type";

export interface ApiResponseReporteInventario {
    ok: boolean;
    message: string;
    data: ApiInventario[];
    meta: {
        total: number;
        normal: number;
        bajo: number;
        sin_stock: number;
    };
}