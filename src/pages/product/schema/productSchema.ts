import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  price: z.coerce.number().min(0, "Precio inválido"),
  idUnidad: z.coerce.number().min(1, "Unidad requerida"),
  idCategory: z.coerce.number().min(1, "Categoría requerida"),
  idBrand: z.coerce.number().min(1, "Marca requerida"),
  idPresentation: z.coerce.number().min(1, "Presentación requerida"),
  description: z.string().min(1, "Descripción requerida"),
  image: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;