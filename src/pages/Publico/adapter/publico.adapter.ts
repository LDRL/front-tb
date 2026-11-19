import { ApiPublico, Publico } from '../models';

export const PublicoAdapter = (publico: ApiPublico): Publico => {
  return {
    id: publico._id,
    name: publico.nombre,
    status: publico.estado,
  };
};

export function PublicoListAdapter(apiPublicoList: ApiPublico[]): Publico[] {
  return apiPublicoList.map(PublicoAdapter);
}
