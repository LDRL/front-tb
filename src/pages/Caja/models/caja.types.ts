export interface ApiCajaSucursal {
  idsucursal: number;
  nombre: string;
}

export interface ApiCajaUsuario {
  _id: number;
  nombre?: string;
  apellido?: string;
  username?: string;
}

export interface ApiCaja {
  idcaja: number;
  nombre: string;
  idsucursal: number;
  estado: number | boolean;
  Sucursal?: ApiCajaSucursal | null;
}

export interface ApiArqueoBloque {
  operaciones: number;
  total: number;
}

export interface ApiArqueoOtroMedio {
  idtipopago: number;
  nombre: string;
  operaciones: number;
  total: number;
}

export interface ApiArqueoMovimientoConcepto {
  tipo: 'INGRESO' | 'EGRESO';
  concepto: string;
  operaciones: number;
  total: number;
}

export interface ApiArqueo {
  idsesion: number;
  idcaja: number;
  estado: 'ABIERTA' | 'CERRADA';
  monto_apertura: number;
  ventas_efectivo: ApiArqueoBloque;
  compras_efectivo: ApiArqueoBloque;
  ingresos_manuales: ApiArqueoBloque;
  egresos_manuales: ApiArqueoBloque;
  monto_esperado: number;
  monto_contado?: number | null;
  diferencia?: number | null;
  monto_esperado_al_cierre?: number | null;
  otros_medios_pago?: {
    ventas: ApiArqueoOtroMedio[];
    compras: ApiArqueoOtroMedio[];
  };
  movimientos_por_concepto?: ApiArqueoMovimientoConcepto[];
  operaciones?: {
    ventas: number;
    compras: number;
    movimientos: number;
  };
}

export interface ApiCajaSesion {
  idsesion: number;
  idcaja: number;
  idusuario_apertura: number;
  monto_apertura: number | string;
  fecha_apertura: string;
  fecha_cierre?: string | null;
  estado: 'ABIERTA' | 'CERRADA';
  monto_esperado?: number | string | null;
  monto_contado?: number | string | null;
  diferencia?: number | string | null;
  idusuario_cierre?: number | null;
  observaciones?: string | null;
  Caja?: ApiCaja | null;
  UsuarioApertura?: ApiCajaUsuario | null;
  UsuarioCierre?: ApiCajaUsuario | null;
  arqueo?: ApiArqueo;
}

export interface ApiCajaMovimiento {
  idmovimiento: number;
  tipo: 'INGRESO' | 'EGRESO';
  concepto: string;
  importe: number | string;
  descripcion?: string | null;
  referencia?: string | null;
  fecha: string;
  idsesion: number;
  idusuario: number;
  Usuario?: ApiCajaUsuario | null;
}

export interface ApiMeta {
  total: number;
  totalPages?: number;
  totalPage?: number;
  currentPage?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  message?: string;
  ok?: boolean;
  data: T;
  meta?: ApiMeta | null;
}

// Domain
export interface Caja {
  id: number;
  name: string;
  branchId: number;
  branchName?: string;
  status: boolean;
}

export interface CajaUsuario {
  id: number;
  name: string;
  username?: string;
}

export interface ArqueoBloque {
  operaciones: number;
  total: number;
}

export interface Arqueo {
  sessionId: number;
  cajaId: number;
  status: 'ABIERTA' | 'CERRADA';
  openingAmount: number;
  cashSales: ArqueoBloque;
  cashPurchases: ArqueoBloque;
  manualIncome: ArqueoBloque;
  manualExpenses: ArqueoBloque;
  expectedAmount: number;
  countedAmount?: number | null;
  difference?: number | null;
  expectedAtClose?: number | null;
  otherPaymentMethods?: {
    sales: { paymentTypeId: number; name: string; operations: number; total: number }[];
    purchases: { paymentTypeId: number; name: string; operations: number; total: number }[];
  };
  movementsByConcept?: { type: 'INGRESO' | 'EGRESO'; concept: string; operations: number; total: number }[];
  operations?: { sales: number; purchases: number; movements: number };
}

export interface CajaSesion {
  id: number;
  cajaId: number;
  cajaName?: string;
  branchId?: number;
  branchName?: string;
  openedBy?: CajaUsuario | null;
  closedBy?: CajaUsuario | null;
  openingAmount: number;
  openedAt: string;
  closedAt?: string | null;
  status: 'ABIERTA' | 'CERRADA';
  expectedAmount?: number | null;
  countedAmount?: number | null;
  difference?: number | null;
  observations?: string | null;
  arqueo?: Arqueo;
}

export interface CajaMovimiento {
  id: number;
  type: 'INGRESO' | 'EGRESO';
  concept: string;
  amount: number;
  description?: string | null;
  reference?: string | null;
  date: string;
  sessionId: number;
  userId: number;
  user?: CajaUsuario | null;
}

export interface CajaState {
  search: string;
}

export const EmptyCajaState: CajaState = {
  search: '',
};

export interface CreateCajaPayload {
  nombre: string;
  idsucursal?: number;
  estado?: boolean | number;
}

export interface UpdateCajaPayload {
  nombre?: string;
  estado?: boolean | number;
}

export interface AbrirSesionPayload {
  monto_apertura: number;
  observaciones?: string;
}

export interface CerrarSesionPayload {
  monto_contado: number;
  observaciones?: string;
}

export interface MovimientoPayload {
  tipo: 'INGRESO' | 'EGRESO';
  concepto: string;
  importe: number;
  descripcion?: string;
  referencia?: string;
}
