// Info about an Brand in the API
export interface ApiBrand {
    _id: number;
    nombre:string;
}

export interface ApiResponseBrand {
    message: string;
    data: ApiBrand[]; //Todo cambiar a data cuando en la api mande data en ves de marcas
    ok: boolean;
    meta: {
        total: number,
        totalPage: number,
        currentPage: number,
        limit: number
    }
}

/// Manejo en el frontend
export interface Brand {
    id:number;
    name: string;
}

export const BrandEmptyState: Brand = {
    id: 0,
    name: '',
}

export type BrandList = Array<Brand>

/// Slice 
export interface BrandState {
    currentBrand: Brand | null;
    search: string;
}

export const EmptyBrandState: BrandState = {
    currentBrand: null,
    search: ''
};


export type CreateOrUpdateBrandResponse = {
  ok: boolean;
  message: string;
  data: ApiBrand;
  meta: null;
};