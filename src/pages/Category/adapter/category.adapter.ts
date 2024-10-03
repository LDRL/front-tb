import { ApiCategory, Category} from "../models";

export const CategoryAdapter = (category: ApiCategory): Category => {
    return{
        id: category._id,
        name: category.nombre,
    }
}

export function CategoryListAdapter(apiCategoryList: ApiCategory[]): Category[] {
    return apiCategoryList.map(CategoryAdapter);
}
