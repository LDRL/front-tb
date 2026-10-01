import { useCallback } from 'react';

import { ProductForm } from '../models/product.domain.type';
import { useCreateProduct, useUpdateProduct } from './useProduct';

export type SaveProductInput = {
  form: ProductForm;
  /** The product being edited, if any. Its productCode identifies the update target. */
  product: Pick<ProductForm, 'productCode'> | null;
};

/**
 * Owns the create-or-update decision so the form component does not need to
 * know that saving a product means picking between two endpoints and two
 * different payload shapes (update needs the productCode).
 */
export const useSaveProduct = () => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isSaving = createProduct.isPending || updateProduct.isPending;

  const saveProduct = useCallback(
    async ({ form, product }: SaveProductInput) => {
      if (product) {
        await updateProduct.mutateAsync({
          productCode: product.productCode,
          data: form,
        });
        return 'updated' as const;
      }

      await createProduct.mutateAsync(form);
      return 'created' as const;
    },
    [createProduct, updateProduct]
  );

  return { saveProduct, isSaving };
};
