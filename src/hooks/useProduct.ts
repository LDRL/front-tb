import { useState, useEffect, useCallback, useRef } from 'react';
// import { fetchProductList, productUrl } from "../../services/product";
// import { Product, ProductList } from '../../models';
import { PaginationModel, pageSize } from '@/utils';
import { ProductList, ProductListAdapter, fetchProductList, productUrl } from '@/pages/product';
import { useSelector } from 'react-redux';
import { useFetchProducts } from '@/pages/product/hooks/useProductOption';

export const useProducts = (initialPage: number = 1) => {
    const search = useSelector((state:any) => state.product.search);

    const [products, setProducts] = useState<ProductList>([]);
    const [totalProduct, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(initialPage);

    const [paginationModel, setPaginationModel] = useState<PaginationModel>({
        page: initialPage - 1,
        pageSize: pageSize,
    });

    const { data, error, isLoading } = useFetchProducts(page,search);
   

    useEffect(() => {
        if(data){
            const adaptedProducts = data ? ProductListAdapter(data.data) : [];
            setProducts(adaptedProducts || []);
            setTotal(data?.total || 0);
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