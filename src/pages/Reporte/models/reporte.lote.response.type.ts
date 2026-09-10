import { ApiLotePorVencer } from "./reporte.lote.api.type";

export interface ApiResponseReporteLote {
    ok: boolean;
    message: string;
    data: ApiLotePorVencer[];
    meta: {
        total: number;
        dias: number;
        vencido: number;
        critico: number;
        proximo: number;
    };
}