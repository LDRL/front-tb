import { ApiLotePorVencer, LoteList, LotePorVencer } from "../models";

export const LotePorVencerAdapter = (api: ApiLotePorVencer): LotePorVencer => ({
    idLote: api.idlote,
    codigoProd: api.codigoprod,
    producto: api.producto,
    marca: api.marca,
    unidad: api.unidad,
    idSucursal: api.idsucursal,
    sucursal: api.sucursal,
    cantidadInicial: api.cantidad_inicial,
    cantidadDisponible: api.cantidad_disponible,
    fechaIngreso: api.fecha_ingreso,
    fechaVencimiento: api.fecha_vencimiento,
    diasRestantes: api.dias_restantes,
    urgencia: api.urgencia,
});

export const LoteListAdapter = (apiList: ApiLotePorVencer[]): LoteList =>
    apiList.map(LotePorVencerAdapter);