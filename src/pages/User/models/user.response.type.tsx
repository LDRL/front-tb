import { UserApi } from "./user.api.type";

export interface UserApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
}

export interface UserApiResponseList {
    message: string;
    data: UserApi[]; 
    ok: boolean;
    meta: {
        total: number,
        totalPage: number,
        currentPage: number,
        limit: number
    }
}

export type CreateUserResponse = UserApiResponse<UserApi>;
export type ApiUserResponse = UserApiResponse<UserApi>;