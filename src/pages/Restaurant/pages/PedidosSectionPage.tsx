import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import RestaurantOrderPage from './RestaurantOrderPage';

type PedidosTab = 'panel';

export default function PedidosSectionPage() {
  const [tab, setTab] = useState<PedidosTab>('panel');

  return (
    <Box>
      <Tabs value={tab} onChange={(_, value: PedidosTab) => setTab(value)} sx={{ mb: 2 }}>
        <Tab label="Panel de pedidos" value="panel" />
      </Tabs>

      {tab === 'panel' && <RestaurantOrderPage />}
    </Box>
  );
}
