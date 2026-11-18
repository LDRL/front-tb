export interface ApiTalla {
  _id: number;
  nombre: string;
  tipo: string;
  orden: number;
  estado: boolean;
}

export interface ApiResponseTalla {
  message: string;
  data: ApiTalla[];
  ok: boolean;
  meta: {
    total: number;
  };
}

export interface Talla {
  id: number;
  name: string;
  type: string;
  order: number;
  status: boolean;
}

export const TallaEmptyState: Talla = {
  id: 0,
  name: '',
  type: '',
  order: 0,
  status: true,
};

export type TallaList = Array<Talla>;

export interface TallaState {
  currentTalla: Talla | null;
  search: string;
}

export const EmptyTallaState: TallaState = {
  currentTalla: null,
  search: '',
};

export type CreateOrUpdateTallaResponse = {
  ok: boolean;
  message: string;
  data: ApiTalla;
  meta: null;
};
