import { Navigate, Route, Routes } from 'react-router-dom';
import RestaurantLayout from './RestaurantLayout';
import PedidosSectionPage from './pages/PedidosSectionPage';
import CajaSectionPage from './pages/CajaSectionPage';
import MenuSectionPage from './pages/MenuSectionPage';

export default function RestaurantRoutes() {
  return (
    <Routes>
      <Route element={<RestaurantLayout />}>
        <Route index element={<Navigate to="pedidos" replace />} />
        <Route path="pedidos" element={<PedidosSectionPage />} />
        <Route path="caja" element={<CajaSectionPage />} />
        <Route path="menu" element={<MenuSectionPage />} />
        <Route path="*" element={<Navigate to="pedidos" replace />} />
      </Route>
    </Routes>
  );
}
