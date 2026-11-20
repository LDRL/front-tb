import { useState } from 'react';
import { Alert, Box, Tab, Tabs, Typography } from '@mui/material';

type CajaTab = 'cortes' | 'movimientos';

export default function CajaSectionPage() {
  const [tab, setTab] = useState<CajaTab>('cortes');

  return (
    <Box>
      <Tabs value={tab} onChange={(_, value: CajaTab) => setTab(value)} sx={{ mb: 2 }}>
        <Tab label="Cortes de caja" value="cortes" />
        <Tab label="Entradas y retiros de efectivo" value="movimientos" />
      </Tabs>

      {tab === 'cortes' && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Cortes de caja</Typography>
          <Alert severity="info">Sección en construcción. Aquí se gestionarán los cortes de caja.</Alert>
        </Box>
      )}

      {tab === 'movimientos' && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Entradas y retiros de efectivo</Typography>
          <Alert severity="info">Sección en construcción. Aquí se registrarán entradas y retiros de efectivo.</Alert>
        </Box>
      )}
    </Box>
  );
}
