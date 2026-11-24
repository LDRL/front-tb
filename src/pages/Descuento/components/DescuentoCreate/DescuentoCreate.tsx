import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardForm from "@/components/Cards/CardForm";
import Loading from "@/components/Loading";
import { FormAutocompleteAsync, FormDate, FormInputNumber } from "@/components";
import { PrivateRoutes } from "@/models";
import { getErrorMessage } from "@/utils/axiosClient";
import { useFetchProductOptions } from "@/hooks/useOption";
import { DescuentoEmptyState, DescuentoFormValues } from "../../models";
import { useCreateDescuento, useGetDescuento, useUpdateDescuento } from "../../hooks/useDescuento";
import "./DescuentoCreate.css";

const DescuentoCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [subtitulo, setSubtitulo] = useState("Nuevo");
  const [productSearch, setProductSearch] = useState("");

  const { control, handleSubmit, reset, watch } = useForm<DescuentoFormValues>({
    defaultValues: DescuentoEmptyState,
  });

  const type = watch("type");
  const selectedProductPresentationId = watch("productPresentationId");
  const selectedProductLabel = watch("productLabel");
  const { data: productOptions = [], isLoading: loadingProducts } = useFetchProductOptions(productSearch);
  const { data: descuentoData, isLoading: loadingDescuento } = useGetDescuento(id ?? "");

  const mergedProductOptions = useMemo(() => {
    const opts = (productOptions as any[]).map((o) => ({ value: Number(o.value), label: String(o.label) }));
    if (
      selectedProductPresentationId &&
      !opts.some((o) => o.value === Number(selectedProductPresentationId))
    ) {
      opts.unshift({
        value: Number(selectedProductPresentationId),
        label: selectedProductLabel || `Presentación #${selectedProductPresentationId}`,
      });
    }
    return opts;
  }, [productOptions, selectedProductPresentationId, selectedProductLabel]);
  const createMutation = useCreateDescuento();
  const updateMutation = useUpdateDescuento();

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && descuentoData) {
      reset(descuentoData);
      setSubtitulo("Editar");
    } else if (!isEditing) {
      reset(DescuentoEmptyState);
      setSubtitulo("Nuevo");
    }
  }, [isEditing, descuentoData, reset]);

  const onSubmit = async (form: DescuentoFormValues) => {
    if (!form.productPresentationId) {
      toast.error("Selecciona un producto/presentación");
      return;
    }

    const value = Number(form.value);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("El valor del descuento debe ser mayor a 0");
      return;
    }
    if (form.type === "porcentaje" && value > 100) {
      toast.error("El porcentaje no puede ser mayor a 100");
      return;
    }
    if (form.startDate && form.endDate && form.endDate.isBefore(form.startDate, "day")) {
      toast.error("La fecha fin no puede ser menor a la fecha inicio");
      return;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(form);
        toast.success("Descuento actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Descuento creado exitosamente");
      }
      navigate(`/private/${PrivateRoutes.DESCUENTO}`, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const loading = loadingDescuento || createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      {loading && <Loading loading />}
      <CardForm titulo="Descuento" subtitulo={subtitulo}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="descuento-form-grid">
            <div className="descuento-field-full">
              <FormAutocompleteAsync<DescuentoFormValues, { value: number; label: string }>
                name="productPresentationId"
                control={control}
                label="Producto / Presentación"
                options={mergedProductOptions}
                isLoading={loadingProducts}
                rules={{ required: "Producto/presentación es requerido" }}
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                onInputChange={(value) => setProductSearch(value)}
              />
            </div>

            <Controller
              name="type"
              control={control}
              rules={{ required: "Tipo es requerido" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Tipo de descuento"
                  error={!!error}
                  helperText={error?.message}
                >
                  <MenuItem value="porcentaje">Porcentaje (%)</MenuItem>
                  <MenuItem value="monto_fijo">Monto fijo (Q)</MenuItem>
                </TextField>
              )}
            />

            <FormInputNumber
              name="value"
              control={control}
              label={type === "porcentaje" ? "Valor (%)" : "Valor (Q)"}
              rules={{ required: "Valor es requerido" }}
              maxDecimals={2}
            />

            <FormInputNumber
              name="minimum"
              control={control}
              label="Cantidad mínima"
              maxDecimals={2}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  value={field.value ? 1 : 0}
                  onChange={(e) => field.onChange(Number(e.target.value) === 1)}
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </TextField>
              )}
            />

            <FormDate name="startDate" control={control} label="Fecha inicio" />
            <FormDate name="endDate" control={control} label="Fecha fin" />
          </div>

          <div className="container_button">
            <Button variant="contained" type="submit" sx={{ mt: 2 }} disabled={loading}>
              Guardar
            </Button>
            <Button
              variant="contained"
              type="button"
              sx={{ mt: 2 }}
              color="error"
              onClick={() => navigate(`/private/${PrivateRoutes.DESCUENTO}`)}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  );
};

export default DescuentoCreate;
