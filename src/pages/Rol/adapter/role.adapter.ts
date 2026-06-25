import { RoleApi } from "../models/role.api.type";
import { Role } from "../models/role.domain.type";

export const RoleAdapter = (role: RoleApi): Role => {
    return {
        _id: role._id,
        nombrerol: role.nombrerol,
        estado: role.estado,
        permisos: role.Permisos ?? [],
    };
};

export const RoleListAdapter = (apiRoleList: RoleApi[]): Role[] => {
    return apiRoleList.map(RoleAdapter);
};
