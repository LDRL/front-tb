import {useQuery} from '@tanstack/react-query'
import { ApiBrand, ApiResponseBrand } from '@/pages/Brand';
import { ApiPresentation, ApiResponsePresentation } from '@/pages/Presentation';
import { ApiCategory, ApiResponseCategory } from '@/pages/Category';
import axiosClient from '@/utils/axiosClient';


export interface Option{
    value: number;
    label: string;
    direction?: string;
    price?: number;
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
    Presentaciones: ApiProductPresentation[];
    Categoria: ApiCategory;
}

interface ApiProductResponse {
    msg: string;
    data: Product[];
}

interface ApiProductPresentation {
    codigo_barras: string;
    idprodPresenta: number;
    precio_venta?: number;
    Presentacion: ApiPresentation;
}


const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchProviderOptions = (search: string) => {
  return useQuery<Option[], Error>({
    queryKey: ["dropdownProvider", search],
    queryFn: async () => {
      const url = search
        ? `${apiUrl}proveedor?search=${search}`
        : `${apiUrl}proveedor/`;

      const response = await axiosClient.get<ApiProviderResponse>(url);
      return ProvidersAdapter(response.data.data);
    },
    staleTime: 1000 * 60 * 5,
  });
};



const ProvidersAdapter = (providers: Provider[]): Option[] => {
    return providers.map(provider => ({
        value: provider._id,
        label: provider.nombre,
        direction: provider.direccion,
    }));
};

export const useFetchProductOptions = (search: string) => {
  return useQuery<Option[], Error>({
    queryKey: ['dropdownProduct', search], // 🔥 IMPORTANTE
    queryFn: async () => {
      const url = search
        ? `${apiUrl}productos?search=${search}`
        : `${apiUrl}productos/`; // 🔥 default

      const response = await axiosClient.get<ApiProductResponse>(url);
      return ProductsAdapter(response.data.data);
    },
    //enabled: search.length >= 2, // 🔥 evita llamadas innecesarias
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
};

const ProductsAdapter = (products: Product[]): Option[] => {
    return products.flatMap(product =>
        product.Presentaciones.map(Presentacion => ({
            value: Presentacion.idprodPresenta,
            label: `${product.Categoria.nombre} - ${product.Marca.nombre} - ${product.nombre} - ${Presentacion.Presentacion.nombre}`,
            price: Presentacion.precio_venta ?? 0
        }))
    );
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


// Type Client

interface ApiTypeClient {
    idtipoCli: number;
    nombre: string;
    estado: string | null;
}

interface ApiTypeClientResponse{
    msg: string;
    data: ApiTypeClient[];
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
            const response = await axiosClient.get<ApiResponseCategory>(apiUrl+"categorias/");
            return categoriasAdapter(response.data.data);
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
            const response = await axiosClient.get<ApiResponseBrand>(apiUrl+"marcas/");
            return MarcasAdapter(response.data.data);
        }
    });
};

const MarcasAdapter = (marcas: ApiBrand[]): Option[] => {
    return marcas.map(marca => ({
        value: marca._id,
        label: marca.nombre,
    }));
};

export const useFetchPresentacionOptions = (search: string) => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownPresentacion', search], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api

            const url = search
                ? `${apiUrl}presentaciones?search=${search}`
                : `${apiUrl}presentaciones/`; // 🔥 default

            const response = await axiosClient.get<ApiResponsePresentation>(url);
            
            return PresentacionesAdapter(response.data.data);
        },
          //enabled: search.length >= 2, // 🔥 evita llamadas innecesarias
    staleTime: 1000 * 60 * 5, // cache 5 min
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
            const response = await axiosClient.get<ApiUnitResponse>(apiUrl+"unidades/");
            return UnitsAdapter(response.data.data);
        }
    });
};

const UnitsAdapter = (presentaciones: ApiUnit[]): Option[] => {
    return presentaciones.map(presentacion => ({
        value: presentacion._id,
        label: presentacion.nombre,
    }));
};


// Role

interface ApiRole {
    _id: number;
    nombrerol: string;
    estado: string | null;
}

interface ApiRoleResponse {
    msg: string;
    data: ApiRole[];
    ok: boolean;
}

export const useFetchRoleOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownRole'],
        queryFn: async () => {
            const response = await axiosClient.get<ApiRoleResponse>(`${apiUrl}roles/`);
            return RolesAdapter(response.data.data);
        },
    });
};

const RolesAdapter = (roles: ApiRole[]): Option[] => {
    return roles.map(role => ({
        value: role._id,
        label: role.nombrerol,
    }));
};

// Tipo cliente

export const useFetchTypeClientsOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownUnit'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
        queryFn: async() => { // queryFn especifica la funcion para el consumo de la api
            const response = await axiosClient.get<ApiTypeClientResponse>(apiUrl+"tipocliente/");
            return TypeClientsAdapter(response.data.data);
        }
    });
};

const TypeClientsAdapter = (tipos: ApiTypeClient[]): Option[] => {
    return tipos.map(tipo => ({
        value: tipo.idtipoCli,
        label: tipo.nombre,
    }));
};

//sucursales

interface ApiSucursal {
    idsucursal: number;
    nombre: string;
}

interface ApiSucursalResponse {
    msg: string;
    data: ApiSucursal[];
    ok: boolean;
}

export const useFetchSucursalOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownSucursal'],
        queryFn: async () => {
            const response = await axiosClient.get<ApiSucursalResponse>(`${apiUrl}sucursales/`);
            return SucursalAdapter(response.data.data);
        },
    });
};

const SucursalAdapter = (roles: ApiSucursal[]): Option[] => {
    return roles.map(role => ({
        value: role.idsucursal,
        label: role.nombre,
    }));
};