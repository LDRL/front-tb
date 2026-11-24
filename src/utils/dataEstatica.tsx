import HomeIcon from '@mui/icons-material/Home';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon  from '@mui/icons-material/Inventory';
import ShoppingCartIcon   from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';

import { PERMISSIONS } from '@/modules/auth/helper/permissions';

export interface SidebarSubLink {
  title: string;
  path: string;
  icon?: React.ReactNode;
  permission?: string | null;
}

export interface SidebarLink {
  label: string;
  icon: React.ReactNode;
  to: string;
  path?: string;
  permission: string | string[] | null;

  subNav?: SidebarSubLink[];

  iconOpened?: React.ReactNode;
  iconClosed?: React.ReactNode;
}

export const DesplegableUser = [
  {
    text: "Mi perfil",
    icono: "",
    tipo: "miperfil",
  },
  {
    text: "Configuracion",
    icono: "",
    tipo: "configuracion",
  },
  {
    text: "Cerrar sesión",
    icono: "",
    tipo: "cerrarsesion",
  },
];

export const LinksArray: SidebarLink[] = [

  {
    label: "Home",
    icon: <HomeIcon />,
    to: "/private/dashboard",
    path: "/private/dashboard",
    permission: null
  },


  {
    label: "Inventario",
    icon: <InventoryIcon />,
    to: "#",
    permission: [
      PERMISSIONS.PRODUCTS.READ,
      PERMISSIONS.CATEGORIES.READ,
      PERMISSIONS.BRANDS.READ,
      PERMISSIONS.PRESENTATIONS.READ,
      PERMISSIONS.UNITS.READ,
      PERMISSIONS.TALLAS.READ,
      PERMISSIONS.COLORS.READ,
      PERMISSIONS.PUBLICOS.READ
    ],

    subNav: [
      {
        title: "Producto",
        path: "/private/product",
        permission: PERMISSIONS.PRODUCTS.READ
      },
      {
        title: "Categorias",
        path: "/private/category",
        permission: PERMISSIONS.CATEGORIES.READ,
      },
      {
        title: "Marcas",
        path: "/private/brand",
        permission: PERMISSIONS.BRANDS.READ,
      },
      {
        title: "Presentaciones",
        path: "/private/presentation",
        permission: PERMISSIONS.PRESENTATIONS.READ,
      },
      {
        title: "Unidades de medida",
        path: "/private/unit",
        permission: PERMISSIONS.UNITS.READ,
      },
      {
        title: "Tallas",
        path: "/private/talla",
        permission: PERMISSIONS.TALLAS.READ,
      },
      {
        title: "Colores",
        path: "/private/color",
        permission: PERMISSIONS.COLORS.READ,
      },
      {
        title: "Públicos",
        path: "/private/publico",
        permission: PERMISSIONS.PUBLICOS.READ,
      },
    ],
  },
  {
    label: "Ventas",
    icon: <PointOfSaleIcon />,
    to: "/private/sale",
    path: "/private/sale",
    permission: PERMISSIONS.SALES.READ
  },
  {
    label: "POS",
    icon: <PointOfSaleIcon />,
    to: "/private/pos",
    path: "/private/pos",
    permission: PERMISSIONS.SALES.READ
  },

  {
    label: "Caja",
    icon: <AccountBalanceWalletIcon />,
    to: "#",
    permission: PERMISSIONS.CAJA.READ,
    subNav: [
      {
        title: "Sesión de caja",
        path: "/private/caja/sesion",
        permission: PERMISSIONS.CAJA.READ,
      },
      {
        title: "Historial",
        path: "/private/caja/historial",
        permission: PERMISSIONS.CAJA.READ,
      },
    ],
  },

  {
    label: "Compras",
    icon: <ShoppingCartIcon />,
    to: "/private/buy",
    path: "/private/buy",
    permission: PERMISSIONS.PURCHASES.READ
  },

  {
    label: "Contactos",
    icon: <PersonIcon />,
    to: "#",
    permission: [
      PERMISSIONS.PROVIDERS.READ,
      PERMISSIONS.CLIENTS.READ
    ],

    subNav: [
      {
        title: "Proveedores",
        path: "/private/proveedor",
        permission: PERMISSIONS.PROVIDERS.READ,
      },
      {
        title: "Clientes",
        path: "/private/client",
        permission: PERMISSIONS.CLIENTS.READ,
      },
    ],
  },

  {
    label: "Administración",
    icon: <SettingsIcon />,
    to: "#",
    permission: PERMISSIONS.USERS.READ,

    subNav: [
      {
        title: "Roles",
        path: "/private/rol",
        permission: PERMISSIONS.ROLES.READ,
      },
      {
        title: "Usuarios",
        path: "/private/user",
        permission: PERMISSIONS.USERS.READ,
      },
    ],
  },
  {
    label: "Reportes",
    icon: <SummarizeIcon />,
    to: "#",
    permission: null,

    subNav: [
      {
        title: "Inventario",
        path: "/private/reporte/inventario",
        permission: PERMISSIONS.REPORT.READ
      },
      {
        title: "Lotes",
        path: "/private/reporte/lote",
        permission: PERMISSIONS.LOTE.READ
      },
    ],
  },
];

export const SecondarylinksArray = [
  {
    label: "Configuración",
    icon: "",
    to: "/configurar",
  },
];
