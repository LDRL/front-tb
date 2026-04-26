export interface ApiSupplier {
  _id : number;
  nombre: string;
  direccion: string;
  telefono: number;
  email: string;
  estado: boolean;
  nit: string;
}

export interface ApiCreateSupplier {
  nombre: string;
  direccion: string;
  telefono: number;
  email: string;
  nit: string;
}