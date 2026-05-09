export interface Client {
    id:number;
    name: string;
    lastName: string;
    telphone: string;
    email: string;
    state: string;
    fullName?: string;
    nit: string;
    address: string;
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