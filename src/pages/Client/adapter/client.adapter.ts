import { ApiClient } from "../models";
import { Client } from "../models";

export const ClientAdapter = (api: ApiClient): Client => ({
    id: api._id,
    nit: api.nit,
    name: api.nombres,
    lastName: api.apellidos,
    direccion: api.direccion,
    email: api.email,
    telefono: api.telefono,
    estado: api.estado,
    fullName: `${api.nombres} ${api.apellidos}`,
});

export const ClientListAdapter = (apiList: ApiClient[]): Client[] =>
    apiList.map(ClientAdapter);
