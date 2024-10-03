import HomeIcon from '@mui/icons-material/Home';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import SummarizeIcon from '@mui/icons-material/Summarize';
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
    icon: <HomeIcon />,
    to: "/private/product",
    path: "/private/product",
  },
  {
    label: "Categorias",
    icon: <ProductionQuantityLimitsIcon />,
    to: "/private/category",
    path: "/private/category",
  },
  {
    label: "Productos",
    icon: <ProductionQuantityLimitsIcon />,
    to: "/private/producto",
    path: "/categorias",
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