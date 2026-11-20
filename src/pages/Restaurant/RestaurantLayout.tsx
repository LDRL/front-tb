import { Alert, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { selectIsRestaurantMode } from '@/redux/configSlice';
import { RestaurantCatalogProvider } from './hooks';

export default function RestaurantLayout() {
  const isRestaurantMode = useSelector(selectIsRestaurantMode);

  return (
    <div>
      <div className="page-title-box">
        <h4>Módulo gastronómico</h4>
      </div>

      <Box sx={{ margin: '10px' }}>
        {!isRestaurantMode ? (
          <Alert severity="info" sx={{ maxWidth: 900 }}>
            Este módulo está disponible cuando el modo de negocio es <strong>Restaurante</strong>.
            Podés activarlo desde Administración &gt; Configuración.
          </Alert>
        ) : (
          <RestaurantCatalogProvider>
            <Outlet />
          </RestaurantCatalogProvider>
        )}
      </Box>
    </div>
  );
}
