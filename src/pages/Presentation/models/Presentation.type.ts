// Info about an Presentation in the API
export interface ApiPresentation {
    _id: number;
    nombre:string;
}

export interface ApiResponse {
    msg: string;
    presentacion: ApiPresentation[]; //Todo cambiar a data cuando en la api mande data en ves de marcas
    total: number;
    currentPage: number;
}

/// Manejo en el frontend
export interface Presentation {
    id:number;
    name: string;
}

export const PresentationEmptyState: Presentation = {
    id: 0,
    name: '',
}

export type PresentationList = Array<Presentation>

/// Slice 
export interface PresentationState {
    currentPresentation: Presentation | null;
    search: string;
}

export const EmptyPresentationState: PresentationState = {
    currentPresentation: null,
    search: ''
};