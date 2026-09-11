export interface ApiUnit {
    _id: number;
    nombre: string;
    abreviatura: string;
    estado: boolean;
}

export interface ApiResponseUnit {
    message: string;
    data: ApiUnit[];
    ok: boolean;
    meta: {
        total: number;
    };
}

/// Manejo en el frontend
export interface Unit {
    id: number;
    name: string;
    abbreviation: string;
    status: boolean;
}

export const UnitEmptyState: Unit = {
    id: 0,
    name: '',
    abbreviation: '',
    status: true,
}

export type UnitList = Array<Unit>

/// Slice
export interface UnitState {
    currentUnit: Unit | null;
    search: string;
}

export const EmptyUnitState: UnitState = {
    currentUnit: null,
    search: ''
};

export type CreateOrUpdateUnitResponse = {
    ok: boolean;
    message: string;
    data: ApiUnit;
    meta: null;
};