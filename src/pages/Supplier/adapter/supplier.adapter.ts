import { ApiCreateSupplier, ApiSupplier } from "../models/supplier.api.type";
import { Supplier } from "../models/supplier.domain.type";
import { SupplierForm } from "../models/supplier.view.type";

export const mapApiToSupplier = (p: ApiSupplier): Supplier => ({
  code: p._id,
  name: p.nombre,
  address: p.direccion,
  phone: p.telefono,
  mail: p.email,
  // The API sends 0/1 for estado, not a real boolean. Coerced here so the
  // domain type stops lying and no consumer has to remember this. Same as
  // client.adapter.ts.
  state: Boolean(p.estado),
  nit: p.nit
});

export function SupplierListAdapter(apiList: ApiSupplier[]): Supplier[] {
    return apiList.map(mapApiToSupplier);
}

//No se agrega la imagen porque no es seguro si se manda en el payload por lo que es mejor agregarlo en la UI
export const mapSupplierToApi = (p: SupplierForm): ApiCreateSupplier => ({
  nombre: p.name,
  direccion: p.address,
  telefono: p.phone,
  email: p.mail,
  nit: p.nit,
});