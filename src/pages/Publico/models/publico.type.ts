export interface ApiPublico {
  _id: number;
  nombre: string;
  estado: boolean;
}

export interface ApiResponsePublico {
  message: string;
  data: ApiPublico[];
  ok: boolean;
  meta: {
    total: number;
  };
}

export interface Publico {
  id: number;
  name: string;
  status: boolean;
}

export const PublicoEmptyState: Publico = {
  id: 0,
  name: '',
  status: true,
};

export type PublicoList = Array<Publico>;

export interface PublicoState {
  currentPublico: Publico | null;
  search: string;
}

export const EmptyPublicoState: PublicoState = {
  currentPublico: null,
  search: '',
};

export type CreateOrUpdatePublicoResponse = {
  ok: boolean;
  message: string;
  data: ApiPublico;
  meta: null;
};
