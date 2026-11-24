export const PERMISSIONS = {

  USERS: {
    READ: "usuarios:read",
    CREATE: "usuarios:create",
    UPDATE: "usuarios:update",
    DELETE: "usuarios:delete",
  },

  ROLES: {
    READ: "roles:read",
    CREATE: "roles:create",
    UPDATE: "roles:update",
    DELETE: "roles:delete",
  },

  BRANDS: {
    READ: "marcas:read",
    CREATE: "marcas:create",
    UPDATE: "marcas:update",
    DELETE: "marcas:delete",
  },

  CATEGORIES: {
    READ: "categorias:read",
    CREATE: "categorias:create",
    UPDATE: "categorias:update",
    DELETE: "categorias:delete",
  },

  PRESENTATIONS: {
    READ: "presentaciones:read",
    CREATE: "presentaciones:create",
    UPDATE: "presentaciones:update",
    DELETE: "presentaciones:delete",
  },

  UNITS: {
    READ: "unidades:read",
    CREATE: "unidades:create",
    UPDATE: "unidades:update",
    DELETE: "unidades:delete",
  },

  TALLAS: {
    READ: "tallas:read",
    CREATE: "tallas:create",
    UPDATE: "tallas:update",
    DELETE: "tallas:delete",
  },

  COLORS: {
    READ: "colores:read",
    CREATE: "colores:create",
    UPDATE: "colores:update",
    DELETE: "colores:delete",
  },

  PUBLICOS: {
    READ: "publicos:read",
    CREATE: "publicos:create",
    UPDATE: "publicos:update",
    DELETE: "publicos:delete",
  },

  PRODUCTS: {
    READ: "productos:read",
    CREATE: "productos:create",
    UPDATE: "productos:update",
    DELETE: "productos:delete",
  },

  PROVIDERS: {
    READ: "proveedores:read",
    CREATE: "proveedores:create",
    UPDATE: "proveedores:update",
    DELETE: "proveedores:delete",
  },

  CLIENTS: {
    READ: "clientes:read",
    CREATE: "clientes:create",
    UPDATE: "clientes:update",
    DELETE: "clientes:delete",
  },

  PURCHASES: {
    READ: "compras:read",
    CREATE: "compras:create",
    UPDATE: "compras:update",
    DELETE: "compras:delete",
  },

  SALES: {
    READ: "ventas:read",
    CREATE: "ventas:create",
    UPDATE: "ventas:update",
    DELETE: "ventas:delete",
  },

  BRANCHES: {
    READ: "sucursales:read",
    CREATE: "sucursales:create",
    UPDATE: "sucursales:update",
    DELETE: "sucursales:delete",
  },

  CAJA: {
    READ: "caja:read",
    CREATE: "caja:create",
    UPDATE: "caja:update",
    DELETE: "caja:delete",
    OPERAR: "caja:operar",
  },

  DESCUENTOS: {
    READ: "descuentos:read",
    CREATE: "descuentos:create",
    UPDATE: "descuentos:update",
    DELETE: "descuentos:delete",
  },

  REPORT: {
    READ: "reporte:read",
  },

  LOTE: {
    READ: "lotes:read",
  }

} as const;