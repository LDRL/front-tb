import { ApiClient } from "./client.api.type";

export interface ApiResponseClient {
    ok: boolean;
    message: string;
    data: ApiClient[];
    meta: {
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface ApiSingleClientResponse {
    ok: boolean;
    message: string;
    data: ApiClient;
}
