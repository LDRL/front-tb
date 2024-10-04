import {useQuery} from '@tanstack/react-query'

interface Option{
    value: number;
    label: string;
}

interface Categoria {
    _id: number;
    nombre: string;
    estado: string | null;
}

interface Marca {
    _id: number;
    nombre: string;
    estado: string | null;
}

interface Presentacion {
    _id: number;
    nombre: string;
    estado: string | null;
}

interface ApiResponse {
    msg: string;
    data: Categoria[];
}

interface ApiMarcaResponse{
    msg: string;
    marcas: Marca[];
}

interface ApiPresentacionResponse{
    msg: string;
    presentacion: Presentacion[];
}

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownOptions'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api
            const response = await fetch(apiUrl+"categorias/");
            if(!response.ok){
                throw new Error('Errr al cargar las opciones')
            }

            const data: ApiResponse = await response.json();
            return categoriasAdapter(data.data);
        }
    });
};

const categoriasAdapter = (categorias: Categoria[]): Option[] => {
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

            const data: ApiMarcaResponse = await response.json();
            return MarcasAdapter(data.marcas);
        }
    });
};

const MarcasAdapter = (marcas: Marca[]): Option[] => {
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

            const data: ApiPresentacionResponse = await response.json();
            return PresentacionesAdapter(data.presentacion);
        }
    });
};

const PresentacionesAdapter = (presentaciones: Presentacion[]): Option[] => {
    return presentaciones.map(presentacion => ({
        value: presentacion._id,
        label: presentacion.nombre,
    }));
};