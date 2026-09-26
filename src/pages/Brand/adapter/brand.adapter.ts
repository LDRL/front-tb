import { ApiBrand, Brand} from "../models";

export const BrandAdapter = (brand: ApiBrand): Brand => {
    return{
        id: brand._id,
        name: brand.nombre,
        status: brand.estado,
    }
}

export function BrandListAdapter(apiBrandList: ApiBrand[]): Brand[] {
    return apiBrandList.map(BrandAdapter);
}
