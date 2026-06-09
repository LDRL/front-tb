export interface UserApi {
    _id?: string;
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    password?: string;
    imagen?: string;
    codigoemp?: number;
    estado?: number;
    idsucursal?: number;
    roles?: number[];
}


export interface UserForm {
    _id?: string;
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    password?: string;
    imagen?: string;
    codigoemp?: number;
    estado?: number;
    idsucursal?: number;
    rol: number;
}



