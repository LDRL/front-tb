export interface Client {
    id: number;
    nit: string;
    name: string;
    lastName: string;
    direccion: string;
    email: string;
    telefono: string;
    estado: number;
    fullName?: string;
}

export type ClientList = Client[];

export const ClientEmptyState: Client = {
    id: 0,
    nit: "",
    name: "",
    lastName: "",
    direccion: "",
    email: "",
    telefono: "",
    estado: 1,
};

export interface ClientForm {
    id?:number,
    name: string;
    lastName: string;
    telphone: string;
    email: string;
    state: number;
    fullName?: string;
    nit: string;
    address: string;
    idTypeCli: number | string;
}

export interface ClientState {
    currentClient: Client | null;
    search: string;
}

export const EmptyClientState: ClientState = {
    currentClient: null,
    search: "",
};
