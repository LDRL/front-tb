import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormAutocompleteAsync, FormInputText } from "@/components";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/axiosClient";
import { Client, ClientForm as ClientFormType } from "../../models";
import { useCreateClient, useUpdateClient } from "../../hooks/useClient";
import { Option, useFetchTypeClientsOptions } from "@/hooks/useOption";

type Props = {
  open: boolean;
  onClose: () => void;
  client: Client | null;
};

const defaultValues = {
  nit: "",
  name: "",
  lastName: "",
  address: "",
  email: "",
  telphone: "",
  idTypeCli: "",
};

const ClientFormModal: React.FC<Props> = ({ open, onClose, client }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: typeCliOptions = [], isLoading: isTypeCliLoading } = useFetchTypeClientsOptions();

  const { control, handleSubmit, reset } = useForm<ClientFormType>({
    defaultValues,
  });

  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  useEffect(() => {
    if (open) {
      reset(
        client
          ? {
              nit: client.nit,
              name: client.name,
              lastName: client.lastName,
              address: client.direccion,
              email: client.email,
              telphone: client.telefono,
              idTypeCli: client.idTypeCli,
            }
          : defaultValues
      );
    }
  }, [open, client, reset]);

  const onSubmit = async (data: ClientFormType) => {
    setLoading(true);
    try {
      if (client) {
        await updateClientMutation.mutateAsync({ id: client.id, form: data });
        toast.success("Cliente actualizado exitosamente");
      } else {
        await createClientMutation.mutateAsync(data);
        toast.success("Cliente creado exitosamente");
      }
      onClose();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading loading />}

      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            borderBottom: "2px solid #e9ebec",
          }}
        >
          {client ? "Editar cliente" : "Nuevo cliente"}
        </DialogTitle>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <DialogContent sx={{ px: 2.5, py: 2.5, display: "flex", flexDirection: "column", gap: 3 }}>
            <FormInputText
              name="nit"
              control={control}
              label="Nit"
              rules={{ required: "El nit es requerido" }}
            />

            <FormInputText
              name="name"
              control={control}
              label="Nombres"
              rules={{ required: "Los nombres son requeridos" }}
            />

            <FormInputText
              name="lastName"
              control={control}
              label="Apellidos"
              rules={{ required: "Los apellidos son requeridos" }}
            />

            <FormInputText
              name="address"
              control={control}
              label="Dirección"
              rules={{ required: "La dirección es requerida" }}
            />

            <FormInputText
              name="email"
              control={control}
              label="Correo electrónico"
              rules={{ required: "La dirección es requerida" }}
            />

            <FormInputText
              name="telphone"
              control={control}
              label="Teléfono"
            />

            <FormAutocompleteAsync
              name="idTypeCli"
              control={control}
              label="Tipo de cliente"
              options={typeCliOptions}
              isLoading={isTypeCliLoading}
              rules={{ required: "El tipo de cliente es requerido" }}
              getOptionLabel={(opt: Option) => opt.label}
              getOptionValue={(opt: Option) => opt.value}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 2.5,
              pb: 2,
              //flexDirection: isMobile ? "column" : "row",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={onClose}
              sx={{
                borderRadius: 5,
                fontSize: isMobile ? "0.7rem" : "0.875rem",
                minHeight: isMobile ? "12px" : "auto",
                py: isMobile ? 0.8 : 1,
                //width: isMobile ? "100%" : "auto",
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              type="submit"
              sx={{
                borderRadius: 5,
                fontSize: isMobile ? "0.7rem" : "0.875rem",
                minHeight: isMobile ? "12px" : "auto",
                py: isMobile ? 0.8 : 1,
                //width: isMobile ? "100%" : "auto",
              }}
            >
              {client ? "Actualizar" : "Guardar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default ClientFormModal;