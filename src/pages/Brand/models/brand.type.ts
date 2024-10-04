// Info about an Brand in the API
export interface ApiBrand {
    _id: number;
    nombre:string;
}

export interface ApiResponse {
    msg: string;
    marcas: ApiBrand[]; //Todo cambiar a data cuando en la api mande data en ves de marcas
    total: number;
    currentPage: number;
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