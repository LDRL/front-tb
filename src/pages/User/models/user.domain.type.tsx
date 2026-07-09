export interface User {
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
    Roles?: number[];
}


export const EmptyUser: User = {
    _id: "",
    nombre: '',
    apellido:'',
    username:'',
    email:'',
    password:'',
    imagen:'',
    codigoemp:0,
    estado:1,
    idsucursal:0
}


/// Slice 
export interface UserState {
    currentUser: User | null;
    search: string;
}

export const EmptyUserState: UserState = {
    currentUser: null,
    search: ''
};

