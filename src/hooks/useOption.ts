import {useQuery} from '@tanstack/react-query'
import { ApiBrand, ApiResponseBrand } from '@/pages/Brand';
import { ApiPresentation, ApiResponsePresentation } from '@/pages/Presentation';
import { ApiCategory, ApiResponseCategory } from '@/pages/Category';

interface Option{
    value: number;
    label: string;
    direction?: string;
}

interface Provider {
    _id: number;
    nombre: string;
    direccion: string;
    estado: string | null;
}

interface ApiProviderResponse {
    message: string;
    data: Provider[];
    ok: boolean;
}

interface Product {
    codigoprod: number;
    _id: number;
    nombre: string;
    Marca: ApiBrand;
    Presentacion: ApiPresentation;
    Categoria: ApiCategory;
}

interface ApiProductResponse {
    msg: string;
    data: Product[];
}

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchProviderOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownProvider'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api
            const response = await fetch(apiUrl+"proveedor/");

            if(!response.ok){
                throw new Error('Errr al cargar las opciones')
            }

            const data: ApiProviderResponse = await response.json();
            return ProvidersAdapter(data.data);
        }
    });
};

const ProvidersAdapter = (providers: Provider[]): Option[] => {
    return providers.map(provider => ({
        value: provider._id,
        label: provider.nombre,
        direction: provider.direccion,
    }));
};

//Obtener productos 
export const useFetchProductOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownProduct'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api
            const response = await fetch(apiUrl+"productos/");

            if(!response.ok){
                throw new Error('Errr al cargar las opciones')
            }

            const data: ApiProductResponse = await response.json();
            return ProductsAdapter(data.data);
        }
    });
};

const ProductsAdapter = (products: Product[]): Option[] => {
    return products.map(product => ({
        value: product.codigoprod,
        label: `${product.nombre} - ${product.Marca.nombre} - ${product.Presentacion.nombre} - ${product.Categoria.nombre}`
    }));
};


interface ApiUnit {
    _id: number;
    nombre: string;
    estado: string | null;
}


interface ApiUnitResponse{
    msg: string;
    data: ApiUnit[];
    meta: {
        total: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
    ok:boolean;
}


export const useFetchOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownOptions'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api
            const response = await fetch(apiUrl+"categorias/");
            if(!response.ok){
                throw new Error('Errr al cargar las opciones')
            }

            const data: ApiResponseCategory = await response.json();
            return categoriasAdapter(data.data);
        }
    });
};

const categoriasAdapter = (categorias: ApiCategory[]): Option[] => {
    return categorias.map(categoria => ({
        value: categoria._id,
        label: categoria.nombre,
    }));
};

export const useFetchMarcaOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownMarca'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api
            const response = await fetch(apiUrl+"marcas/");
            if(!response.ok){
                throw new Error('Errr al cargar las opciones')
            }

            const data: ApiResponseBrand = await response.json();
            return MarcasAdapter(data.data);
        }
    });
};

const MarcasAdapter = (marcas: ApiBrand[]): Option[] => {
    return marcas.map(marca => ({
        value: marca._id,
        label: marca.nombre,
    }));
};

export const useFetchPresentacionOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownPresentacion'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api
            const response = await fetch(apiUrl+"presentaciones/");

            if(!response.ok){
                throw new Error('Errr al cargar las opciones')
            }

            const data: ApiResponsePresentation= await response.json();
            return PresentacionesAdapter(data.data);
        }
    });
};

const PresentacionesAdapter = (presentaciones: ApiPresentation[]): Option[] => {
    return presentaciones.map(presentacion => ({
        value: presentacion._id,
        label: presentacion.nombre,
    }));
};

{/** Catalogo para unidad de medidas */}
export const useFetchUnitOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownUnit'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api
            const response = await fetch(apiUrl+"unidades/");

            if(!response.ok){
                throw new Error('Errr al cargar las opciones')
            }

            const data: ApiUnitResponse = await response.json();
            return UnitsAdapter(data.data);
        }
    });
};

const UnitsAdapter = (presentaciones: ApiUnit[]): Option[] => {
    return presentaciones.map(presentacion => ({
        value: presentacion._id,
        label: presentacion.nombre,
    }));
};