import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAppConfig } from '@/redux/configSlice';
import { useRestaurantCatalog } from '../hooks';

export default function RestaurantOverviewPage() {
  const appConfig = useSelector(selectAppConfig);
  const { catalog, status, error } = useRestaurantCatalog();

  if (status === 'loading' || status === 'idle') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={22} />
        <Typography variant="body2">Cargando catálogo gastronómico...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado del módulo
              </Typography>
              <Typography variant="body2"><strong>Modo:</strong> {appConfig.businessMode}</Typography>
              <Typography variant="body2"><strong>Combos:</strong> {appConfig.features.combos ? 'Habilitado' : 'Deshabilitado'}</Typography>
              <Typography variant="body2"><strong>Recetas:</strong> {appConfig.features.recipes ? 'Habilitado' : 'Deshabilitado'}</Typography>
              <Typography variant="body2"><strong>Modificadores:</strong> {appConfig.features.modifiers ? 'Habilitado' : 'Deshabilitado'}</Typography>
              <Typography variant="body2"><strong>Inventario por insumos:</strong> {appConfig.features.inventoryByIngredients ? 'Habilitado' : 'Deshabilitado'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Catálogo (base local)
              </Typography>
              <Typography variant="body2">Insumos / Ítems: {catalog.inventoryItems.length}</Typography>
              <Typography variant="body2">Grupos de modificadores: {catalog.modifierGroups.length}</Typography>
              <Typography variant="body2">Recetas: {catalog.recipes.length}</Typography>
              <Typography variant="body2">Combos: {catalog.combos.length}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Los datos se guardan localmente por ahora (preparado para migrar a API/DB).
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
