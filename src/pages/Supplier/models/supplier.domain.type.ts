export interface Supplier {
    code?: number;
    name: string;
    address: string;
    phone: number;
    mail: string;
    state?: boolean;
    nit: string;
}

export const EmptySupplier: Supplier = {
    code: 0,
    name: '',
    address:'',
    phone:0,
    mail:'',
    state: true,
    nit:''
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


export type SupplierList = Array<Supplier>