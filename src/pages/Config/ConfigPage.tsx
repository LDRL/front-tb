import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import type { AppDispatch } from '@/redux/store';
import {
  loadConfig,
  saveConfig,
  selectAppConfig,
  selectConfigError,
  selectConfigStatus,
} from '@/redux/configSlice';
import type { AppConfig, BusinessMode } from '@/modules/config/models';

const featureLabels: Record<keyof AppConfig['features'], string> = {
  recipes: 'Recetas / BOM',
  modifiers: 'Modificadores y extras',
  inventoryByIngredients: 'Inventario por producto',
  kds: 'KDS / cocina',
};

export default function ConfigPage() {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector(selectAppConfig);
  const status = useSelector(selectConfigStatus);
  const error = useSelector(selectConfigError);

  const [draft, setDraft] = useState<AppConfig>(config);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadConfig());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === 'ready' || status === 'error') {
      setDraft(config);
    }
  }, [config, status]);

  const isBusy = status === 'loading' || status === 'saving';
  const isRestaurant = draft.businessMode === 'restaurant';

  const hasChanges = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(config),
    [draft, config]
  );

  const handleModeChange = (mode: BusinessMode) => {
    setDraft((prev) => ({
      ...prev,
      businessMode: mode,
      features:
        mode === 'restaurant'
          ? prev.features
          : {
              recipes: false,
              modifiers: false,
              inventoryByIngredients: false,
              kds: false,
            },
    }));
  };

  const handleFeatureChange = (key: keyof AppConfig['features'], value: boolean) => {
    setDraft((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    await dispatch(saveConfig(draft));
  };

  return (
    <div>
      <div className="page-title-box">
        <h4>Configuración del sistema</h4>
      </div>

      <Box sx={{ margin: '10px', maxWidth: 900 }}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Definí el modo de operación y las capacidades del sistema. Esta configuración se guarda
                localmente por ahora y está preparada para integrarse con una API/DB más adelante.
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}
              {status === 'ready' && !hasChanges && (
                <Alert severity="success">Configuración cargada y sincronizada.</Alert>
              )}

              <FormControl fullWidth size="small">
                <FormLabel sx={{ mb: 1 }}>Modo de negocio</FormLabel>
                <Select
                  value={draft.businessMode}
                  onChange={(e) => handleModeChange(e.target.value as BusinessMode)}
                  disabled={isBusy}
                >
                  <MenuItem value="retail">Retail (actual)</MenuItem>
                  <MenuItem value="restaurant">Restaurante</MenuItem>
                </Select>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  En modo retail el sistema se comporta como hasta ahora. El modo restaurante habilita
                  capacidades adicionales sin modificar los flujos existentes.
                </Typography>
              </FormControl>

              <Divider />

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Capacidades de restaurante
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Estas opciones se aplican cuando el modo restaurante está activo. Sirven como base para
                  módulos como recetas, personalizaciones e inventario por insumos.
                </Typography>

                <Stack spacing={1}>
                  {(Object.keys(featureLabels) as Array<keyof AppConfig['features']>).map((key) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Switch
                          checked={draft.features[key]}
                          onChange={(e) => handleFeatureChange(key, e.target.checked)}
                          disabled={isBusy || !isRestaurant}
                        />
                      }
                      label={featureLabels[key]}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isBusy || !hasChanges || status === 'idle'}
                >
                  Guardar configuración
                </Button>
                {isBusy && <CircularProgress size={22} />}
                {status === 'saving' && (
                  <Typography variant="body2" color="text.secondary">
                    Guardando...
                  </Typography>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
