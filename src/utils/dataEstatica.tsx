import HomeIcon from '@mui/icons-material/Home';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import CategoryIcon from '@mui/icons-material/Category';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
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
  },
  {
    label: "Producto",
    icon: <ProductionQuantityLimitsIcon />,
    to: "/private/product",
    path: "/private/product",
  },
  {
    label: "Categorias",
    icon: <CategoryIcon />,
    to: "/private/category",
    path: "/private/category",
  },
  {
    label: "Marcas",
    icon: <ProductionQuantityLimitsIcon />,
    to: "/private/brand",
    path: "/private/brand",
  },
  {
    label: "Presentaciones",
    icon: <ProductionQuantityLimitsIcon />,
    to: "/private/presentation",
    path: "/private/presentation",
  },
  {
    label: "Ventas",
    icon: <PointOfSaleIcon />,
    to: "/private/sale",
    path: "/private/sale",
  },
  {
    label: "Compras",
    icon: <ShoppingBagIcon />,
    to: "/private/buy",
    path: "/private/buy",
  },
  {
    label: "Reportes",
    icon: <SummarizeIcon/>,
    to: "/reportes",
  },
 
];
export const SecondarylinksArray = [
  {
    label: "Configuración",
    icon: "",
    to: "/configurar",
  },

];
