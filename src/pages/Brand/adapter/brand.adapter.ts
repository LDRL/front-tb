import { ApiBrand, Brand} from "../models";

export const BrandAdapter = (category: ApiBrand): Brand => {
    return{
        id: category._id,
        name: category.nombre,
    }
}

export function BrandListAdapter(apiCategoryList: ApiBrand[]): Brand[] {
    return apiCategoryList.map(BrandAdapter);
}
