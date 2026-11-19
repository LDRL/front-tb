import { useState } from 'react';
import { Alert, Box, Tab, Tabs } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectIsRestaurantMode } from '@/redux/configSlice';
import { RestaurantCatalogProvider } from './hooks';
import RestaurantOverviewPage from './pages/RestaurantOverviewPage';
import InventoryItemsPage from './pages/InventoryItemsPage';
import ModifierGroupsPage from './pages/ModifierGroupsPage';
import RecipesPage from './pages/RecipesPage';
import CombosPage from './pages/CombosPage';
import RestaurantOrderPage from './pages/RestaurantOrderPage';

type RestaurantTab = 'overview' | 'order' | 'inventory' | 'modifiers' | 'recipes' | 'combos';

export default function RestaurantPage() {
  const isRestaurantMode = useSelector(selectIsRestaurantMode);
  const [tab, setTab] = useState<RestaurantTab>('overview');

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
            <Tabs
              value={tab}
              onChange={(_, value: RestaurantTab) => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              <Tab label="Resumen" value="overview" />
              <Tab label="Pedido" value="order" />
              <Tab label="Insumos / Ítems" value="inventory" />
              <Tab label="Modificadores" value="modifiers" />
              <Tab label="Recetas" value="recipes" />
              <Tab label="Combos" value="combos" />
            </Tabs>

            {tab === 'overview' && <RestaurantOverviewPage />}
            {tab === 'order' && <RestaurantOrderPage />}
            {tab === 'inventory' && <InventoryItemsPage />}
            {tab === 'modifiers' && <ModifierGroupsPage />}
            {tab === 'recipes' && <RecipesPage />}
            {tab === 'combos' && <CombosPage />}
          </RestaurantCatalogProvider>
        )}
      </Box>
    </div>
  );
}
