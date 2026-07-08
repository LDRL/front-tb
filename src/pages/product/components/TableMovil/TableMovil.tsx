import React from 'react';
import { Button, Card, CardContent, Pagination } from '@mui/material';
import { Product } from '../../models/product.domain.type';

interface ProductListProps {
    products: Product[];
    totalProduct: number;
    paginationModel: { page: number; pageSize: number };
    handleEditProduct: (product: Product) => void;
    handlePaginationModelChange: (newPaginationModel: { page: number; pageSize: number }) => void;
    totalPagesMobile: number;
}

const urlSinImage = "/sinImagen.png";

const getImageUrl = (image?: File | string | null) => {
  if (!image) return urlSinImage;

  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  return image;
};

const TableMovil: React.FC<ProductListProps> = ({
    products,
    totalProduct,
    paginationModel,
    handleEditProduct,
    handlePaginationModelChange,
    totalPagesMobile,
}) => {
    return (
        <>
            {products.map((product) => {
                return (
                    <Card key={product.productCode} style={{ marginBottom: '16px' }}>
                        <CardContent key={product.productCode}>
                            <h3>{product.name}</h3>
                            <p>Código: {product.productCode}</p>
                            <p>Marca: {product.brand.name}</p>
                            <p>Categoría: {product.category.name}</p>

                            <img
                                src={getImageUrl(product.image)}
                                alt="producto"
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    e.currentTarget.src = urlSinImage;
                                }}
                                style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover"
                                }}
                            />
                            <br />

                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleEditProduct(product)}
                            >
                                Editar
                            </Button>
                        </CardContent>
                    </Card>
                );
            })}
            <Pagination
                count={Math.ceil(totalProduct / totalPagesMobile)}
                page={paginationModel.page + 1}
                onChange={(event, value) =>
                    handlePaginationModelChange({ page: value - 1, pageSize: paginationModel.pageSize })
                }
                color="primary"
                style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
                siblingCount={0}
                variant="outlined"
            />
        </>
    );
};

export default TableMovil;
