export interface ApiTipoClie {
    idtipoCli: number;
    nombre: string;
    estado: boolean;
}

export interface ApiClient {
    _id: number;
    nit: string;
    nombres: string;
    apellidos: string;
    direccion: string;
    email: string;
    telefono: string;
    estado: number;
    idtipoCli: number;
    tipoClie: ApiTipoClie;
}

export interface CreateClientPayload {
    nit: string;
    nombres: string;
    apellidos: string;
    direccion: string;
    email: string;
    telefono: string;
    idtipoCli: number | string;
}
