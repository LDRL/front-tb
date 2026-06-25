export interface Role {
    _id?: number;
    nombrerol: string;
    estado?: number;
    permisos: number[];
}

export const EmptyRole: Role = {
    _id: 0,
    nombrerol: '',
    estado: 1,
    permisos: [],
};

export interface RoleState {
    currentRole: Role | null;
    search: string;
}

export const EmptyRoleState: RoleState = {
    currentRole: null,
    search: '',
};
