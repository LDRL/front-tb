// Info about an Presentation in the API
export interface ApiPresentation {
    _id: number;
    nombre:string;
}

export interface ApiResponsePresentation {
    message: string;
    data: ApiPresentation[]; //Todo cambiar a data cuando en la api mande data en ves de marcas
    ok: boolean;
    meta: {
        total: number,
        totalPage: number,
        currentPage: number,
        limit: number
    }
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

export type CreateOrUpdatePresentationResponse = {
  ok: boolean;
  message: string;
  data: ApiPresentation;
  meta: null;
};