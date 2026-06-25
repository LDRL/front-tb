import HomeIcon from '@mui/icons-material/Home';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import CategoryIcon from '@mui/icons-material/Category';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import { PERMISSIONS } from '@/modules/auth/helper/permissions';

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



//data SIDEBAR
export const LinksArray = [
  // {
  //   label: "Home",
  //   icon: <HomeIcon />,
  //   to: "#",
  //   path:"",
  //   iconOpened:"",
  //   iconClosed:"",
  //   subNav: [
  //     {
  //         title: "Productos",
  //         path: "/private/product",
  //         // icon: <IoIcons.IoIosPaper />,
  //     },
  //     {
  //         title: "nuevo producto",
  //         path: "/productos/crear-producto",
  //         // icon: <IoIcons.IoIosPaper />,
  //     },
  //   ],
  // },
  {
    label: "Home",
    icon: <HomeIcon />,
    to: "/private/dashboard",
    path: "/private/dashboard",
    permission:null
  },
  {
    label: "Producto",
    icon: <ProductionQuantityLimitsIcon />,
    to: "/private/product",
    path: "/private/product",
    permission: PERMISSIONS.PRODUCTS.READ
  },
  {
    label: "Categorias",
    icon: <CategoryIcon />,
    to: "/private/category",
    path: "/private/category",
    permission: PERMISSIONS.CATEGORIES.READ
  },
  {
    label: "Marcas",
    icon: <ProductionQuantityLimitsIcon />,
    to: "/private/brand",
    path: "/private/brand",
    permission: PERMISSIONS.BRANDS.READ
  },
  {
    label: "Presentaciones",
    icon: <HomeRepairServiceIcon />,
    to: "/private/presentation",
    path: "/private/presentation",
    permission: PERMISSIONS.PRESENTATIONS.READ
  },
  {
    label: "Ventas",
    icon: <PointOfSaleIcon />,
    to: "/private/sale",
    path: "/private/sale",
    permission: PERMISSIONS.SALES.READ
  },
  {
    label: "Compras",
    icon: <ShoppingBagIcon />,
    to: "/private/buy",
    path: "/private/buy",
    permission: PERMISSIONS.PURCHASES.READ
  },
  {
    label: "Usuarios",
    icon: <PersonIcon />,
    to: "/private/user",
    path: "/private/user",
    permission: PERMISSIONS.USERS.READ
  },
  {
    label: "Proveedores",
    icon: <PersonIcon />,
    to: "/private/proveedor",
    path: "/private/proveedor",
    permission: PERMISSIONS.PROVIDERS.READ
  },
  {
    label: "Clientes",
    icon: <GroupIcon />,
    to: "/private/client",
    path: "/private/client",
    permission: PERMISSIONS.CLIENTS.READ
  },
  {
    label: "Roles",
    icon: <SecurityIcon />,
    to: "/private/rol",
    path: "/private/rol",
    permission: PERMISSIONS.ROLES.READ
  },
  {
    label: "Reportes",
    icon: <SummarizeIcon/>,
    to: "/reportes",
    permission:null
  },
 
];
export const SecondarylinksArray = [
  {
    label: "Configuración",
    icon: "",
    to: "/configurar",
  },

];
