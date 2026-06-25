import { RoleApi } from "./role.api.type";

export interface RoleApiResponse {
    message: string;
    data: RoleApi[];
    ok: boolean;
    meta: {
        total: number;
        totalPage: number;
        currentPage: number;
        limit: number;
    };
}

export interface RoleCreateResponse {
    ok: boolean;
    message: string;
    data: RoleApi;
    meta: null;
}
