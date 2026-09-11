export interface ApiPermission {
  _id: number;
  nombre: string;
}

export interface ApiRole {
  _id: number;
  nombrerol: string;
  Permisos: ApiPermission[];
}

interface ApiSucursal {
  idsucursal: number;
  nombre: string;
  direccion: string;
  telefono: number;
}

export interface ApiAuthUser {
  _id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  idsucursal: number;
  Roles: ApiRole[];
  Sucursal: ApiSucursal;
}

export interface LoginApiResponse {
  ok: boolean;
  message: string;

  data: {
    token: string;
    usuario: ApiAuthUser;
  };

  meta: null;
}