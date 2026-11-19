import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createRestaurantId, useRestaurantCatalog } from '../hooks';
import { ComboTemplate, ConfiguredCombo, RestaurantOrderLine, buildRestaurantOrderPayload } from '../models';
import ComboConfiguratorDialog from '../components/ComboConfiguratorDialog';
import { computeConfiguredComboConsumption, formatAvailabilityIssues, getAvailabilityIssues, mergeConsumptions } from '../utils/availability';

const summarizeConfiguredCombo = (configured: ConfiguredCombo): string[] => {
  const lines: string[] = [];
  configured.selections.forEach((sel) => {
    const mods = (sel.modifiers || []).map((m) => m.optionName).filter(Boolean);
    lines.push(`${sel.slotName || 'Slot'}: ${sel.optionName || sel.optionId}${mods.length ? ` (${mods.join(', ')})` : ''}`);
  });
  if (configured.modifiers && configured.modifiers.length > 0) {
    lines.push(`Extras: ${configured.modifiers.map((m) => m.optionName).filter(Boolean).join(', ')}`);
  }
  return lines;
};

export default function RestaurantOrderPage() {
  const { catalog } = useRestaurantCatalog();
  const [selectedCombo, setSelectedCombo] = useState<ComboTemplate | null>(null);
  const [lines, setLines] = useState<RestaurantOrderLine[]>([]);
  const [payloadOpen, setPayloadOpen] = useState(false);

  const activeCombos = useMemo(
    () => catalog.combos.filter((c) => c.isActive !== false),
    [catalog.combos]
  );

  const cartConsumption = useMemo(() => {
    const maps = lines.map((line) => {
      const combo = catalog.combos.find((c) => c.id === line.configuredCombo.comboId);
      return computeConfiguredComboConsumption(catalog, combo, line.configuredCombo, line.quantity);
    });
    return mergeConsumptions(...maps);
  }, [catalog, lines]);

  const cartAvailabilityIssues = useMemo(
    () => getAvailabilityIssues(catalog, cartConsumption),
    [catalog, cartConsumption]
  );

  const addConfiguredCombo = (configured: ConfiguredCombo) => {
    const line: RestaurantOrderLine = {
      id: createRestaurantId(),
      type: 'combo',
      quantity: 1,
      configuredCombo: configured,
      lineTotal: Number(configured.totalPrice.toFixed(2)),
    };
    setLines((prev) => [...prev, line]);
    setSelectedCombo(null);
  };

  const updateQty = (lineId: string, delta: number) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id !== lineId) return line;
        const quantity = Math.max(1, line.quantity + delta);
        return { ...line, quantity, lineTotal: Number((line.configuredCombo.totalPrice * quantity).toFixed(2)) };
      })
    );
  };

  const removeLine = (lineId: string) => setLines((prev) => prev.filter((l) => l.id !== lineId));

  const total = useMemo(
    () => Number(lines.reduce((acc, l) => acc + l.configuredCombo.totalPrice * l.quantity, 0).toFixed(2)),
    [lines]
  );

  const payload = useMemo(() => buildRestaurantOrderPayload(lines), [lines]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Pedido / Venta (configurador de combos)</Typography>

      {activeCombos.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay combos activos. Creá y activá combos en la pestaña <strong>Combos</strong> para poder agregarlos al pedido.
        </Alert>
      )}

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="flex-start">
        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Combos disponibles</Typography>
          <Stack spacing={1.5}>
            {activeCombos.map((combo) => (
              <Card key={combo.id} variant="outlined">
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{combo.name}</Typography>
                  {combo.description && <Typography variant="body2" color="text.secondary">{combo.description}</Typography>}
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Precio base: <strong>Q {Number(combo.basePrice || 0).toFixed(2)}</strong> · {combo.slots?.length || 0} slot(s)
                  </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                  <Button size="small" variant="contained" onClick={() => setSelectedCombo(combo)}>
                    Configurar y agregar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        </Box>

        <Box sx={{ width: { xs: '100%', lg: 420 }, flexShrink: 0 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Pedido actual</Typography>
              {cartAvailabilityIssues.length > 0 && (
                <Alert severity="warning" sx={{ mb: 1.5 }}>
                  Stock insuficiente (preventivo): {formatAvailabilityIssues(cartAvailabilityIssues)}
                </Alert>
              )}
              {lines.length === 0 && (
                <Typography variant="body2" color="text.secondary">No hay ítems agregados.</Typography>
              )}
              <Stack spacing={1.5}>
                {lines.map((line) => (
                  <Box key={line.id} sx={{ p: 1.25, border: '1px solid #eee', borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ pr: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{line.configuredCombo.comboName || 'Combo'}</Typography>
                        {summarizeConfiguredCombo(line.configuredCombo).map((text, idx) => (
                          <Typography key={idx} variant="caption" color="text.secondary" display="block">{text}</Typography>
                        ))}
                      </Box>
                      <IconButton size="small" color="error" onClick={() => removeLine(line.id)} aria-label="Quitar">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconButton size="small" onClick={() => updateQty(line.id, -1)}><RemoveIcon fontSize="small" /></IconButton>
                        <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>{line.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQty(line.id, 1)}><AddIcon fontSize="small" /></IconButton>
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Q {(line.configuredCombo.totalPrice * line.quantity).toFixed(2)}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h6">Q {total.toFixed(2)}</Typography>
              </Stack>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={lines.length === 0 || cartAvailabilityIssues.length > 0}
                onClick={() => setPayloadOpen(true)}
              >
                Generar pedido (payload)
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <ComboConfiguratorDialog
        open={!!selectedCombo}
        combo={selectedCombo}
        modifierGroups={catalog.modifierGroups}
        catalog={catalog}
        baseConsumption={cartConsumption}
        onClose={() => setSelectedCombo(null)}
        onConfirm={addConfiguredCombo}
      />

      <Dialog open={payloadOpen} onClose={() => setPayloadOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Payload estructurado del pedido</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Este es el payload que el frontend puede enviar al backend para confirmar el pedido y que el servidor explote/descuente inventario según selecciones.
          </Typography>
          <Box component="pre" sx={{ m: 0, p: 2, bgcolor: '#f7f7f7', borderRadius: 1, overflow: 'auto', fontSize: 12 }}>
            {JSON.stringify(payload, null, 2)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayloadOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
