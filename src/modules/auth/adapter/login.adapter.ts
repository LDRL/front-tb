import {ApiAuthUser,LoginApiResponse} from "../models/login.api.type";

import {  AuthState,AuthUser} from "../models/login.domain.type";

export const userAdapter = (apiUser: ApiAuthUser): AuthUser => {

  return {
    id: apiUser._id,
    firstName: apiUser.nombre,
    lastName: apiUser.apellido,
    username: apiUser.username,
    email: apiUser.email,
    branchId: apiUser.idsucursal,
    roles: apiUser.Roles.map(role => ({
      id: role._id,
      name: role.nombrerol,
      permissions: role.Permisos.map(permission => ({
        id: permission._id,
        name: permission.nombre
      }))
    }))
  };
};

export const loginAdapter = (response: LoginApiResponse): AuthState => {

  return {
    token: response.data.token,
    user: userAdapter(
      response.data.usuario
    )
  };
};