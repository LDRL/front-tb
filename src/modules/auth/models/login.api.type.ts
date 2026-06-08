export interface ApiPermission {
  _id: number;
  nombre: string;
}

export interface ApiRole {
  _id: number;
  nombrerol: string;
  Permisos: ApiPermission[];
}

export interface ApiAuthUser {
  _id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  idsucursal: number;
  Roles: ApiRole[];
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