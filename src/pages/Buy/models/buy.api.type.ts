export interface ApiDetail {
    cantidad: number,
    costo: number,
    codigoprod: number,
    idsucursal: number
    nombre?: string,
}

export interface ApiProvider {
    _id: number;
    nombre:string;
    direccion: string;
    telefono: string;
    email: string;
    estado: string;
}

export interface ApiBuy {
    _id: number;
    // fecha: Date;
    nombre: string;
    fecha: string;
    direccion: string;
    estado: boolean;
    idproveedor: number;
    Proveedor: ApiProvider;
    Detalles?: ApiDetail[];
    total?: number;
    idsucursal: number;
    idusuario: string;
    // updatedAt: Date
}

//Para obtener el encabezado y detalle de la compra

export interface ApiHeaderBuy {
    _id: string;
    nombre: string;
    fecha: string;
    direccion: string;
    estado: boolean;
    idproveedor: number;
    total: string; // 👈 importante
    idusuario: number;
    idsucursal: number;

    Proveedor: {
        _id: number;
        nombre: string;
        direccion: string;
        telefono: string;
        email: string;
        estado: number;
        nit: string;
    };

    Sucursal: {
        idsucursal: number;
        nombre: string;
        direccion: string;
        telefono: string;
        estado: number;
        es_principal: number;
    };

    Usuario: {
        _id: number;
        nombre: string;
        apellido: string;
        username: string;
        email: string;
    };

    Detalles: ApiHeaderDetail[];
}

export interface ApiHeaderDetail{
    _id: string,
    cantidad: number,
    costo: number,
    Producto: {
        codigoprod: number;
        nombre: string;
        descripcion?: string;
        imagen?: string | null;
        idmarca?: number;
        idpresentacion?: number;
        idcategoria?: number;
        estado?: number;
        precio?: string;
        idunidad?: number | null;
    };
}

//Para crear la compra con su detalle

export interface CreateBuyPayload {
  nombre: string;
  fecha: string;
  direccion: string;
  estado: boolean;
  idproveedor: number;
  idusuario: number;
  idsucursal: number;
  total: number;

  detalles: CreateBuyDetail[];
}

export interface CreateBuyDetail {
  codigoprod: number;
  cantidad: number;
  costo: number;
}