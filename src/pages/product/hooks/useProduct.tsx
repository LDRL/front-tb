import { useState, useEffect} from 'react';
import { PaginationModel, pageSize } from '@/utils';
import { ProductListAdapter } from '@/pages/product';
import { useSelector } from 'react-redux';
import { ApiProduct } from '../models/product.api.type';
import { ProductList, Product, Detail } from '@/pages/product/models/product.domain.type';
import { ApiResponseProductList } from '../models/product.response.type';
import { ProductForm } from '../models/product.domain.type';
import { fetchProductCreate, fetchProductUpdate } from '../services/product';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mapApiToProduct, mapProductToApi } from '../adapter';
import axiosClient from '@/utils/axiosClient';

import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;
const productUrl = `${apiUrl}productos`;

export const useGetProducts = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.product.search);

    const [products, setProducts] = useState<ProductList>([]);
    const [totalProduct, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);

    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchProducts(page, search);

    useEffect(() => {
        if(data){
            const adaptedProducts = data ? ProductListAdapter(data.data) : [];
            setProducts(adaptedProducts || []);
            setTotal(data?.meta.total || 0);
        }
    }, [data]);

    const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
        setPaginationModel(newPaginationModel);
        const newPage = newPaginationModel.page + 1;
        setPage(newPage);
    };



    return {
        products,
        totalProduct,
        isLoading,
        error,
        paginationModel,
        handlePaginationModelChange,
    };
};


export const useFetchProducts = (page: number = 1, search: string) => {
    const queryKey = search ? ['products', search] : ['products', page];
    return useQuery<ApiResponseProductList, Error>({
        queryKey,
        queryFn: async () => {
            const params = search
                ? `?search=${encodeURIComponent(search)}`
                : `?page=${page}&search=`;
            const response = await axiosClient.get<ApiResponseProductList>(`${productUrl}${params}`);
            return response.data;
        },
    });
};


// Hook para obtener un producto específico
export const useGetProduct = (productId: string) => {
    return useQuery<Product, Error>({
        queryKey: ['product', productId], // Clave de consulta
        queryFn: async () => {
            const response = await axiosClient.get<{ data: ApiProduct }>(`${productUrl}/${productId}`);

            if (response.status !== 200) {
                throw new Error('Error al cargar el producto');
            }

            return mapApiToProduct(response.data.data); // Adaptamos y devolvemos el producto
        },
        enabled: !!productId, // Solo se ejecuta si productId está disponible
        // onError: (error) => {
        //     console.error(`Error fetching product: ${error}`);
        // },
    });
};



// Hook para crear un nuevo producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: ProductForm) => {

      const data = mapProductToApi(newProduct);
      const formData = new FormData();

      // agregar campos normales
      Object.entries(data).forEach(([key, value]) => {
        if (key === "presentaciones") {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, value);
        }
    });

      // agregar imagen
      if (newProduct.image instanceof File) {
        formData.append("imagen", newProduct.image);
      }



      const [error, producto] = await fetchProductCreate(
        `${apiUrl}productos`,
        formData
      );

      if (error) throw error;
      if (!producto) throw new Error("Producto no creado");

      return producto;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};


export type UpdateProductDTO = {
  productCode: number;
  data: ProductForm;
};

// Hook para actualizar un producto existente
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productCode, data }: UpdateProductDTO) => {
            const dataNew = mapProductToApi(data);
            const formData = new FormData();

            // agregar campos normales
            Object.entries(dataNew).forEach(([key, value]) => {
                if (key === "presentaciones") {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            // agregar imagen
            if (data.image instanceof File) {
                formData.append("imagen", data.image);
            }

            //const response = await axios.put<{ message: string, data: ApiProduct }>(`${productUrl}${updatedProduct.productCode}/`, product);

            const [error, producto] = await fetchProductUpdate(
                `${apiUrl}productos/${productCode}`,
                formData
            );

            if (error) throw error;
            if (!producto) throw new Error('Error al actualizar el producto');

            return producto;            
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error) => {
            console.error(`Error updating product: ${error}`);
        },
    });
};


export const useProductDetails = () => {
  const [rows, setRows] = useState<Detail[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addRow = (detail: Detail) => {
    if (!editingId) {
      const existing = rows.find(r => r.idPresentation === detail.idPresentation);
      if (existing) {
        toast.error("No puedes asignar la misma presentación más de una vez");
        return;
      }
    }

    setRows(prev => {
      if (editingId) {
        const updated = prev.map(r =>
          r.id === editingId ? { ...r, ...detail, id: r.id } : r
        );
        setEditingId(null);
        return updated;
      }

      return [...prev, { ...detail, id: uuidv4() }];
    });
  };

  const deleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const editRow = (row: Detail) => {
    setEditingId(row.id!);
  };

  return { rows, addRow, deleteRow, editRow, editingId, setEditingId, setRows };
};


