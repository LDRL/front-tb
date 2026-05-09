//Para cliente
export interface ApiClient {
    _id: number;
    nombres:string;
    apellidos:string;
    telefono: string;
    email: string;
    estado: string;
    nit: string;
    direccion: string;
}

export interface ApiClientPost {
    idcliente?: string;
    direccion: string;
}

export interface ClientForm {
    name: string;
    lastName: string;
    telphone: string;
    email: string;
    state: string;
    fullName?: string;
    nit: string;
    address: string;
    idTypeCli: number;
}

export interface CreateClientPayload {
    nombres:string;
    apellidos:string;
    telefono: string;
    email: string;
    estado: string;
    nit: string;
    direccion: string;
    idTipoCli: number;
}