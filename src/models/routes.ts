export const PublicRoutes = {
    LOGIN: 'login',
}

export const PrivateRoutes = {
    PRIVATE: 'private',
    DASHBOARD: 'dashboard',
    HOME: 'home',
    PRODUCT: 'product',
    PRODUCT_CREATE: 'product/create',
    PRODUCT_EDIT: 'product/:id/editar',
    PRODUCT_INITIAL_STOCK: 'product/:id/ingreso-inicial',
    CATEGORY: 'category',
    CATEGORY_CREATE: 'category/create',
    CATEGORY_EDIT: 'category/:id/editar',
    BRAND: 'brand',
    BRAND_CREATE: 'brand/create',
    BRAND_EDIT: 'brand/:id/editar',
    PRESENTATION: 'presentation',
    PRESENTATION_CREATE: 'presentation/create',
    PRESENTATION_EDIT: 'presentation/:id/editar',
    UNIT: 'unit',
    TALLA: 'talla',
    COLOR: 'color',
    PUBLICO: 'publico',
    BUY: 'buy',
    BUY_CREATE: 'buy/create',
    BUY_SHOW: 'buy/:id/show',

    SALE: 'sale',
    SALE_CREATE: 'sale/create',
    SALE_SHOW: 'sale/:id/show',
    POS: 'pos',
    USER: 'user',
    USER_CREATE:'user/create',
    USER_EDIT:'user/:id/editar',

    SUPPLIER: 'proveedor',
    SUPPLIER_CREATE:'proveedor/create',
    SUPPLIER_EDIT:'proveedor/:id/editar',

    CLIENT: 'client',
    CLIENT_CREATE:'client/create',
    CLIENT_EDIT:'client/:id/editar',

    ROL: 'rol',
    ROL_CREATE: 'rol/create',
    ROL_EDIT: 'rol/:id/editar',

    REPORTE: 'reporte',
    REPORTE_INVENTARIO: 'reporte/inventario',
    REPORTE_LOTE_X_VENCER: 'reporte/lote',

    CAJA: 'caja',
    CAJA_SESION_CAJA: 'caja/sesion',
    CAJA_HISTORIAL: 'caja/historial',
    CAJA_SESION: 'caja/sesiones/:id',
}