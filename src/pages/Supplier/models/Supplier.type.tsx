export interface Supplier {
    _id?: string;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    estado?: number;
}

export interface ApiResponse {
    proveedor: Supplier[]; //Todo cambiar a data cuando en la api mande data en ves de marcas
    total: number;
    currentPage: number;
    totalPages:number;
}

export interface ApiGetSupplierList{
    proveedor: Supplier;
    msg: '';
    id: 0;
}

export type SupplierList = Array<Supplier>


export const EmptySupplier: Supplier = {
    _id: "",
    nombre: '',
    direccion:'',
    telefono:'',
    email:'',
    estado:1
}

/// Slice 
export interface SupplierState {
    currentSupplier: Supplier | null;
    search: string;
}

export const EmptySupplierState: SupplierState = {
    currentSupplier: null,
    search: ''
};