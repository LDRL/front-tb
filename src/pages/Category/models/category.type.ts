// Info about an category in the API
export interface ApiCategory {
    _id: number;
    nombre:string;
}

export interface ApiResponse {
    msg: string;
    data: ApiCategory[];
    total: number;
    currentPage: number;
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