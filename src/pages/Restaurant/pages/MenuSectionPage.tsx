import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import InventoryItemsPage from './InventoryItemsPage';
import RecipesPage from './RecipesPage';
import ModifierGroupsPage from './ModifierGroupsPage';
import ProductosPage from './ProductosPage';

type MenuTab = 'ingredientes' | 'recetas' | 'personalizaciones' | 'productos';

export default function MenuSectionPage() {
  const [tab, setTab] = useState<MenuTab>('ingredientes');

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, value: MenuTab) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab label="Ingredientes" value="ingredientes" />
        <Tab label="Recetas" value="recetas" />
        <Tab label="Personalizaciones" value="personalizaciones" />
        <Tab label="Productos" value="productos" />
      </Tabs>

      {tab === 'ingredientes' && <InventoryItemsPage />}
      {tab === 'recetas' && <RecipesPage />}
      {tab === 'personalizaciones' && <ModifierGroupsPage />}
      {tab === 'productos' && <ProductosPage />}
    </Box>
  );
}
