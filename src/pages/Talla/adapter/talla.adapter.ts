import { ApiTalla, Talla } from '../models';

export const TallaAdapter = (talla: ApiTalla): Talla => {
  return {
    id: talla._id,
    name: talla.nombre,
    type: talla.tipo,
    order: talla.orden,
    status: talla.estado,
  };
};

export function TallaListAdapter(apiTallaList: ApiTalla[]): Talla[] {
  return apiTallaList.map(TallaAdapter);
}
