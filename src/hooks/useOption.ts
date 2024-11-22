import {useQuery} from '@tanstack/react-query'
import { ApiBrand } from '@/pages/Brand';
import { ApiPresentation } from '@/pages/Presentation';
import { ApiCategory } from '@/pages/Category';


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
    msg: string;
    proveedor: Provider[];
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
            return ProvidersAdapter(data.proveedor);
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