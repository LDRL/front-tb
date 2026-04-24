// Info about an category in the API
export interface ApiCategory {
    _id: number;
    nombre:string;
}

export interface ApiResponseCategory {
    message: string;
    data: ApiCategory[]; //Todo cambiar a data cuando en la api mande data en ves de marcas
    ok: boolean;
    meta: {
        total: number,
        totalPage: number,
        currentPage: number,
        limit: number
    }
}


/// Manejo en el frontend
export interface Category {
    id:number;
    name: string;
}

export const CategoryEmptyState: Category = {
    id: 0,
    name: '',
}

export type CategoryList = Array<Category>

/// Slice 
export interface CategoryState {
    currentCategory: Category | null;
    search: string;
}
  
export const EmptyCategoryState: CategoryState = {
    currentCategory: null,
    search: ''
};


export type UpdateCategoryResponse = {
  ok: boolean;
  message: string;
  data: ApiCategory;
  meta: null;
};