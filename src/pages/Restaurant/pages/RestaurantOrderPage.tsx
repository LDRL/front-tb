import { Alert, Box, Typography } from '@mui/material';

export default function RestaurantOrderPage() {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Panel de pedidos</Typography>
      <Alert severity="info">
        El flujo de pedidos por combos fue retirado. La gestión de pedidos para productos se definirá próximamente.
      </Alert>
    </Box>
  );
}
