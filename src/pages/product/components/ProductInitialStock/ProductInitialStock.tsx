import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

import CardForm from '@/components/Cards/CardForm';
import Loading from '@/components/Loading';
import { useFetchProviderOptions } from '@/hooks/useOption';
import { PrivateRoutes } from '@/models';
import { fetchBuyCreate } from '@/pages/Buy/services/buy';
import { CreateBuyPayload } from '@/pages/Buy/models/buy.api.type';
import { fetchProduct } from '@/pages/product/services/product';
import { AppStore } from '@/redux/store';

const apiUrl = import.meta.env.VITE_API_URL;

type NormalizedPresentation = {
  idprodPresenta: number;
  name: string;
};

type NormalizedVariant = {
  idvariante: number;
  color: string;
  talla: string;
};

type NormalizedProduct = {
  id: number | string;
  name: string;
  hasVariants: boolean;
  presentations: NormalizedPresentation[];
  variants: NormalizedVariant[];
};

type StockRow = {
  key: string;
  idprodPresenta: number;
  idvariante: number | null;
  color: string;
  talla: string;
  presentacion: string;
  cantidad: string;
};

const toQty = (value: string): number => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n;
};

const normalizeCreatedProduct = (raw: any): NormalizedProduct | null => {
  if (!raw) return null;

  const id = raw.codigoprod ?? raw.productCode ?? raw.id;
  const name = raw.nombre ?? raw.name ?? 'Producto';

  const rawPresentations = raw.Presentaciones ?? raw.presentacions ?? [];
  const presentations: NormalizedPresentation[] = rawPresentations
    .map((p: any) => {
      const idprodPresenta = p.idprodPresenta ?? p.idProdPresenta;
      const pName = p.Presentacion?.nombre ?? p.name ?? p.nombre ?? 'Presentación';
      if (idprodPresenta == null) return null;
      return { idprodPresenta: Number(idprodPresenta), name: String(pName) };
    })
    .filter(Boolean) as NormalizedPresentation[];

  const hasVariants = !!(raw.tiene_variantes ?? raw.hasVariants);
  const rawVariants = raw.variantes ?? raw.Variantes ?? [];
  const variants: NormalizedVariant[] = hasVariants
    ? rawVariants
        .map((v: any) => {
          const idvariante = v.idvariante ?? v.idVariante;
          if (idvariante == null) return null;
          const color = v.color?.nombre ?? v.colorNombre ?? v.Color?.nombre ?? '-';
          const talla = v.talla?.nombre ?? v.tallaNombre ?? v.Talla?.nombre ?? '-';
          return {
            idvariante: Number(idvariante),
            color: String(color),
            talla: String(talla),
          };
        })
        .filter(Boolean) as NormalizedVariant[]
    : [];

  return {
    id: id ?? '',
    name: String(name),
    hasVariants,
    presentations,
    variants,
  };
};

const buildRows = (product: NormalizedProduct): StockRow[] => {
  const rows: StockRow[] = [];

  if (product.hasVariants && product.variants.length > 0) {
    for (const variant of product.variants) {
      for (const pres of product.presentations) {
        rows.push({
          key: `${variant.idvariante}-${pres.idprodPresenta}`,
          idprodPresenta: pres.idprodPresenta,
          idvariante: variant.idvariante,
          color: variant.color,
          talla: variant.talla,
          presentacion: pres.name,
          cantidad: '0',
        });
      }
    }
    return rows;
  }

  for (const pres of product.presentations) {
    rows.push({
      key: `nv-${pres.idprodPresenta}`,
      idprodPresenta: pres.idprodPresenta,
      idvariante: null,
      color: '-',
      talla: '-',
      presentacion: pres.name,
      cantidad: '0',
    });
  }

  return rows;
};

const ProductInitialStock: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const authUser = useSelector((state: AppStore) => state.auth.user);

  const locationProduct = (location.state as any)?.createdProduct;
  const [loadedProduct, setLoadedProduct] = useState<any | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { data: providerOptions = [], isLoading: isProvidersLoading } = useFetchProviderOptions('');

  useEffect(() => {
    if (locationProduct || !id) return;
    let cancelled = false;
    const run = async () => {
      setLoadingProduct(true);
      setLoadError(null);
      try {
        const [err, product] = await fetchProduct(id);
        if (cancelled) return;
        if (err || !product) {
          setLoadError('No se pudo cargar el producto creado.');
        } else {
          setLoadedProduct(product);
        }
      } catch {
        if (!cancelled) setLoadError('No se pudo cargar el producto creado.');
      } finally {
        if (!cancelled) setLoadingProduct(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id, locationProduct]);

  const normalized = useMemo(
    () => normalizeCreatedProduct(locationProduct ?? loadedProduct),
    [locationProduct, loadedProduct]
  );

  const [rows, setRows] = useState<StockRow[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (normalized) {
      setRows(buildRows(normalized));
    }
  }, [normalized]);

  const defaultProvider = providerOptions[0];

  const handleQtyChange = (key: string, value: string) => {
    if (value !== '' && !/^\d*(\.\d*)?$/.test(value)) return;
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, cantidad: value } : r)));
  };

  const goToList = () => {
    navigate(`/private/${PrivateRoutes.PRODUCT}`, { replace: true });
  };

  const positiveRows = rows.filter((r) => toQty(r.cantidad) > 0);
  const zeroCount = rows.length - positiveRows.length;
  const hasZeroRows = zeroCount > 0;

  const doSavePurchase = async () => {
    if (!normalized) return;

    if (positiveRows.length === 0) {
      toast.info('No se registró ingreso inicial: todas las cantidades están en 0.');
      goToList();
      return;
    }

    if (!authUser?.id || !authUser?.branchId) {
      toast.error('No se pudo registrar la compra: falta usuario o sucursal en la sesión.');
      return;
    }

    if (!defaultProvider) {
      toast.error('No se pudo registrar la compra: no hay un proveedor disponible.');
      return;
    }

    const detalles = positiveRows.map((r) => ({
      idprodPresenta: r.idprodPresenta,
      idvariante: r.idvariante,
      cantidad: toQty(r.cantidad),
      costo: 1,
    }));

    const payload: CreateBuyPayload = {
      nombre: `Ingreso inicial - ${normalized.name}`,
      fecha: dayjs().toISOString(),
      direccion: (defaultProvider as any).direction ?? '',
      estado: true,
      idproveedor: Number(defaultProvider.value),
      idusuario: Number(authUser.id),
      idsucursal: Number(authUser.branchId),
      total: detalles.reduce((acc, d) => acc + d.cantidad * d.costo, 0),
      detalles,
    };

    setSaving(true);
    try {
      const [error] = await fetchBuyCreate(`${apiUrl}compras`, payload);
      if (error) {
        toast.error((error as any)?.response?.data?.message || error.message || 'Error al registrar la compra');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['buys'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ingreso inicial registrado exitosamente');
      goToList();
    } catch (e: any) {
      toast.error(e?.message || 'Error al registrar la compra');
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };

  const handleSaveClick = () => {
    if (!normalized) return;
    if (rows.length === 0) {
      toast.info('No hay presentaciones/variantes para registrar ingreso.');
      goToList();
      return;
    }

    if (hasZeroRows) {
      setConfirmOpen(true);
      return;
    }

    doSavePurchase();
  };

  if (loadingProduct) {
    return <Loading loading />;
  }

  if (loadError || !normalized) {
    return (
      <CardForm titulo="Ingreso inicial" subtitulo={normalized?.name || 'Producto'}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError || 'No se encontró la información del producto creado.'}
        </Alert>
        <Button variant="contained" onClick={goToList}>
          Volver al listado
        </Button>
      </CardForm>
    );
  }

  const canSavePurchase = !!authUser?.id && !!authUser?.branchId && !!defaultProvider;

  return (
    <div>
      {(saving || isProvidersLoading) && <Loading loading />}

      <CardForm titulo="Ingreso inicial" subtitulo={normalized.name}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Ingrese las cantidades iniciales por variante y presentación. Las filas con cantidad en 0 no se
            registrarán en el inventario.
          </Typography>
        </Box>

        {!authUser?.branchId && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No se encontró una sucursal en la sesión. No será posible registrar la compra, pero puede omitir el ingreso.
          </Alert>
        )}
        {!isProvidersLoading && !defaultProvider && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No hay un proveedor disponible para registrar la compra inicial. Puede omitir el ingreso.
          </Alert>
        )}

        {rows.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Este producto no tiene presentaciones o variantes para registrar ingreso.
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {normalized.hasVariants && normalized.variants.length > 0 && (
                    <>
                      <TableCell>Color</TableCell>
                      <TableCell>Talla</TableCell>
                    </>
                  )}
                  <TableCell>Presentación venta</TableCell>
                  <TableCell sx={{ width: 180 }}>Cantidad a vender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.key}>
                    {normalized.hasVariants && normalized.variants.length > 0 && (
                      <>
                        <TableCell>{row.color}</TableCell>
                        <TableCell>{row.talla}</TableCell>
                      </>
                    )}
                    <TableCell>{row.presentacion}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={row.cantidad}
                        onChange={(e) => handleQtyChange(row.key, e.target.value)}
                        inputProps={{ min: 0, step: '1' }}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button variant="outlined" color="inherit" onClick={goToList} disabled={saving}>
            Omitir
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveClick}
            disabled={saving || isProvidersLoading || rows.length === 0 || !canSavePurchase}
          >
            Guardar ingreso
          </Button>
        </Box>
        {!canSavePurchase && rows.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
            Complete los requisitos (sesión/sucursal/proveedor) o use "Omitir" para finalizar sin ingreso inicial.
          </Typography>
        )}
      </CardForm>

      <Dialog open={confirmOpen} onClose={() => !saving && setConfirmOpen(false)}>
        <DialogTitle>Registros en 0</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {positiveRows.length === 0
              ? 'Todas las cantidades están en 0. No se registrará ningún ingreso en el inventario. ¿Desea continuar y finalizar sin registrar compra?'
              : `Hay ${zeroCount} registro(s) con cantidad en 0. Estos no serán registrados en el inventario. ¿Desea continuar y guardar solo las cantidades mayores a 0?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              doSavePurchase();
            }}
            variant="contained"
            disabled={saving}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductInitialStock;
