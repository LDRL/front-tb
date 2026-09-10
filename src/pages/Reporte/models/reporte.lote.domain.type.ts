import { UrgenciaLote } from "./reporte.lote.api.type";

export interface LotePorVencer {
    idLote: string;
    codigoProd: number;
    producto: string;
    marca: string;
    unidad: string;
    idSucursal: number;
    sucursal: string;
    cantidadInicial: number;
    cantidadDisponible: number;
    fechaIngreso: string;
    fechaVencimiento: string;
    diasRestantes: number;
    urgencia: UrgenciaLote;
}

export type LoteList = LotePorVencer[];

export interface ReporteLoteMeta {
    total: number;
    dias: number;
    vencido: number;
    critico: number;
    proximo: number;
}