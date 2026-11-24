import {
  ApiArqueo,
  ApiCaja,
  ApiCajaMovimiento,
  ApiCajaSesion,
  ApiCajaUsuario,
  Arqueo,
  Caja,
  CajaMovimiento,
  CajaSesion,
  CajaUsuario,
} from '../models';

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
};

const toNullableNumber = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

export const CajaUsuarioAdapter = (user?: ApiCajaUsuario | null): CajaUsuario | null => {
  if (!user) return null;
  const name = [user.nombre, user.apellido].filter(Boolean).join(' ').trim() || user.username || `Usuario ${user._id}`;
  return {
    id: user._id,
    name,
    username: user.username,
  };
};

export const CajaAdapter = (caja: ApiCaja): Caja => ({
  id: caja.idcaja,
  name: caja.nombre,
  branchId: caja.idsucursal,
  branchName: caja.Sucursal?.nombre,
  status: caja.estado === true || Number(caja.estado) === 1,
});

export const CajaListAdapter = (items: ApiCaja[] = []): Caja[] => items.map(CajaAdapter);

export const ArqueoAdapter = (arqueo: ApiArqueo): Arqueo => ({
  sessionId: arqueo.idsesion,
  cajaId: arqueo.idcaja,
  status: arqueo.estado,
  openingAmount: toNumber(arqueo.monto_apertura),
  cashSales: {
    operaciones: toNumber(arqueo.ventas_efectivo?.operaciones),
    total: toNumber(arqueo.ventas_efectivo?.total),
  },
  cashPurchases: {
    operaciones: toNumber(arqueo.compras_efectivo?.operaciones),
    total: toNumber(arqueo.compras_efectivo?.total),
  },
  manualIncome: {
    operaciones: toNumber(arqueo.ingresos_manuales?.operaciones),
    total: toNumber(arqueo.ingresos_manuales?.total),
  },
  manualExpenses: {
    operaciones: toNumber(arqueo.egresos_manuales?.operaciones),
    total: toNumber(arqueo.egresos_manuales?.total),
  },
  expectedAmount: toNumber(arqueo.monto_esperado),
  countedAmount: toNullableNumber(arqueo.monto_contado),
  difference: toNullableNumber(arqueo.diferencia),
  expectedAtClose: toNullableNumber(arqueo.monto_esperado_al_cierre),
  otherPaymentMethods: {
    sales: (arqueo.otros_medios_pago?.ventas ?? []).map((s) => ({
      paymentTypeId: s.idtipopago,
      name: s.nombre,
      operations: toNumber(s.operaciones),
      total: toNumber(s.total),
    })),
    purchases: (arqueo.otros_medios_pago?.compras ?? []).map((s) => ({
      paymentTypeId: s.idtipopago,
      name: s.nombre,
      operations: toNumber(s.operaciones),
      total: toNumber(s.total),
    })),
  },
  movementsByConcept: (arqueo.movimientos_por_concepto ?? []).map((m) => ({
    type: m.tipo,
    concept: m.concepto,
    operations: toNumber(m.operaciones),
    total: toNumber(m.total),
  })),
  operations: arqueo.operaciones
    ? {
        sales: toNumber(arqueo.operaciones.ventas),
        purchases: toNumber(arqueo.operaciones.compras),
        movements: toNumber(arqueo.operaciones.movimientos),
      }
    : undefined,
});

export const CajaSesionAdapter = (sesion: ApiCajaSesion): CajaSesion => ({
  id: sesion.idsesion,
  cajaId: sesion.idcaja,
  cajaName: sesion.Caja?.nombre,
  branchId: sesion.Caja?.idsucursal,
  branchName: sesion.Caja?.Sucursal?.nombre,
  openedBy: CajaUsuarioAdapter(sesion.UsuarioApertura),
  closedBy: CajaUsuarioAdapter(sesion.UsuarioCierre),
  openingAmount: toNumber(sesion.monto_apertura),
  openedAt: sesion.fecha_apertura,
  closedAt: sesion.fecha_cierre ?? null,
  status: sesion.estado,
  expectedAmount: toNullableNumber(sesion.monto_esperado),
  countedAmount: toNullableNumber(sesion.monto_contado),
  difference: toNullableNumber(sesion.diferencia),
  observations: sesion.observaciones ?? null,
  arqueo: sesion.arqueo ? ArqueoAdapter(sesion.arqueo) : undefined,
});

export const CajaSesionListAdapter = (items: ApiCajaSesion[] = []): CajaSesion[] => items.map(CajaSesionAdapter);

export const CajaMovimientoAdapter = (mov: ApiCajaMovimiento): CajaMovimiento => ({
  id: mov.idmovimiento,
  type: mov.tipo,
  concept: mov.concepto,
  amount: toNumber(mov.importe),
  description: mov.descripcion ?? null,
  reference: mov.referencia ?? null,
  date: mov.fecha,
  sessionId: mov.idsesion,
  userId: mov.idusuario,
  user: CajaUsuarioAdapter(mov.Usuario),
});

export const CajaMovimientoListAdapter = (items: ApiCajaMovimiento[] = []): CajaMovimiento[] =>
  items.map(CajaMovimientoAdapter);
