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
    hasExpiration?: boolean;
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
    controla_vencimiento?: boolean;
}

interface ApiProductResponse {
    msg: string;
    data: Product[];
}

interface ApiProductPrice {
    idprecios: number;
    precio: string;
    tipoprecio: string;
    idprodPresenta: number;
    idtipoCli: number;
    estado: number;
}

interface ApiProductPresentation {
    codigo_barras: string;
    idprodPresenta: number;
    precio_venta?: number | string;
    Presentacion: ApiPresentation;
    Precios?: ApiProductPrice[];
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

export const useFetchProductOptions = (search: string, idTipoCli?: number) => {
  return useQuery<Option[], Error>({
    queryKey: ['dropdownProduct', search, idTipoCli], // 🔥 IMPORTANTE: idTipoCli en la key refresca al cambiar de tipo cliente
    queryFn: async () => {
      const url = idTipoCli
        ? search
          ? `${apiUrl}productos?idtipoCli=${idTipoCli}&search=${search}`
          : `${apiUrl}productos?idtipoCli=${idTipoCli}/`
        : search
          ? `${apiUrl}productos?search=${search}`
          : `${apiUrl}productos/`; // 🔥 default

      const response = await axiosClient.get<ApiProductResponse>(url);
      return ProductsAdapter(response.data.data);
    },
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
};

const ProductsAdapter = (products: Product[]): Option[] => {
    return products.flatMap(product =>
        product.Presentaciones.map(Presentacion => ({
            value: Presentacion.idprodPresenta,
            label: `${product.Categoria.nombre} - ${product.Marca.nombre} - ${product.nombre} - ${Presentacion.Presentacion.nombre}`,
            price: getPresentationPrice(Presentacion),
            hasExpiration: product.controla_vencimiento ?? false,
        }))
    );
};

// Precio por tipo de cliente: usa el precio del arreglo Precios si viene, si no el precio_venta
const getPresentationPrice = (presentacion: ApiProductPresentation): number => {
    const raw = presentacion.Precios?.length
        ? presentacion.Precios[0].precio
        : presentacion.precio_venta;

    return Number(raw ?? 0);
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
        queryKey: ['dropdownTypeClient'], // Se maneja como un objeto dentro de useQueryOptions para el uso de TypeScript 
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

// Publico objetivo
interface ApiPublicoObjetivo {
    _id: number;
    nombre: string;
    estado?: boolean | number;
}

interface ApiPublicoResponse {
    message?: string;
    data: ApiPublicoObjetivo[];
    meta?: { total: number };
    ok?: boolean;
}

export const useFetchPublicoOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownPublico'],
        queryFn: async () => {
            const response = await axiosClient.get<ApiPublicoResponse>(`${apiUrl}publicos/`);
            return PublicosAdapter(response.data.data);
        },
    });
};

const PublicosAdapter = (items: ApiPublicoObjetivo[]): Option[] => {
    return items.map((item) => ({
        value: item._id,
        label: item.nombre,
    }));
};

// Tallas
export interface ApiTalla {
    _id: number;
    nombre: string;
    tipo?: 'ROPA' | 'CALZADO' | string;
    orden?: number;
    estado?: boolean | number;
}

interface ApiTallaResponse {
    message?: string;
    data: ApiTalla[];
    meta?: { total: number };
    ok?: boolean;
}

export const useFetchTallaOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownTalla'],
        queryFn: async () => {
            const response = await axiosClient.get<ApiTallaResponse>(`${apiUrl}tallas/`);
            return TallasAdapter(response.data.data);
        },
    });
};

export const useFetchTallasCatalog = () => {
    return useQuery<ApiTalla[], Error>({
        queryKey: ['catalogTallas'],
        queryFn: async () => {
            const response = await axiosClient.get<ApiTallaResponse>(`${apiUrl}tallas/`);
            return response.data.data || [];
        },
    });
};

const TallasAdapter = (items: ApiTalla[]): Option[] => {
    return items.map((item) => ({
        value: item._id,
        label: item.tipo ? `${item.nombre} (${item.tipo})` : item.nombre,
    }));
};

// Colores
export interface ApiColor {
    _id: number;
    nombre: string;
    hex?: string | null;
    estado?: boolean | number;
}

interface ApiColorResponse {
    message?: string;
    data: ApiColor[];
    meta?: { total: number };
    ok?: boolean;
}

export const useFetchColorOptions = () => {
    return useQuery<Option[], Error>({
        queryKey: ['dropdownColor'],
        queryFn: async () => {
            const response = await axiosClient.get<ApiColorResponse>(`${apiUrl}colores/`);
            return ColoresAdapter(response.data.data);
        },
    });
};

export const useFetchColoresCatalog = () => {
    return useQuery<ApiColor[], Error>({
        queryKey: ['catalogColores'],
        queryFn: async () => {
            const response = await axiosClient.get<ApiColorResponse>(`${apiUrl}colores/`);
            return response.data.data || [];
        },
    });
};

const ColoresAdapter = (items: ApiColor[]): Option[] => {
    return items.map((item) => ({
        value: item._id,
        label: item.hex ? `${item.nombre} (${item.hex})` : item.nombre,
    }));
};