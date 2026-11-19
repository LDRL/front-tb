import { ApiColor, Color } from '../models';

export const ColorAdapter = (color: ApiColor): Color => {
  return {
    id: color._id,
    name: color.nombre,
    hex: color.hex,
    status: color.estado,
  };
};

export function ColorListAdapter(apiColorList: ApiColor[]): Color[] {
  return apiColorList.map(ColorAdapter);
}
