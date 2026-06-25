export interface RoleApi {
    _id?: number;
    nombrerol: string;
    estado?: number;
    Permisos?: number[];
}

export interface RoleForm {
    _id?: number;
    nombrerol: string;
    permisos: number[];
}
