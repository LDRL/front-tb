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
}

export interface ApiResponse {
    usuarios: User[]; //Todo cambiar a data cuando en la api mande data en ves de marcas
    total: number;
    currentPage: number;
    totalPages:number;
}


export type UserList = Array<User>


export const EmptyUser: User = {
    _id: "",
    nombre: '',
    apellido:'',
    username:'',
    email:'',
    password:'',
    imagen:'',
    codigoemp:0,
    estado:1
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