export type UrgenciaLote = "vencido" | "critico" | "proximo";

export interface ApiLotePorVencer {
    idlote: string;
    codigoprod: number;
    producto: string;
    marca: string;
    unidad: string;
    idsucursal: number;
    sucursal: string;
    cantidad_inicial: number;
    cantidad_disponible: number;
    fecha_ingreso: string;
    fecha_vencimiento: string;
    dias_restantes: number;
    urgencia: UrgenciaLote;
}