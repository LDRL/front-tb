import React, { useEffect, useMemo, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormInputText } from '@/components';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { RootState } from '@/redux/store';
import { PrivateRoutes } from '@/models';
import { useCreateRole, useFetchPermisos, useGetRole, useUpdateRole } from '../../hooks/useRole';
import { clearRole, editRole } from '@/redux/rolSlice';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/axiosClient';
import { RoleForm } from '../../models/role.api.type';

import "./RoleCreate.css"

const RoleCreate: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>('');
  const [selectedPermisos, setSelectedPermisos] = useState<number[]>([]);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { currentRole } = useSelector((state: RootState) => state.rol);

  const { control, handleSubmit, reset } = useForm<RoleForm>({
    defaultValues: { _id: 0, nombrerol: '', permisos: [] },
  });

  {/** Obtener los permisos de un rol en especifico */}
  const { data: dataRole } = id ? useGetRole(id) : { data: null };
  {/** Listado de permisos */}
  const { data: permisos = [], isLoading: isLoadingPermisos } = useFetchPermisos();

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  useEffect(() => {
    if (id && dataRole) {
      dispatch(editRole(dataRole));
      return;
    }
    dispatch(clearRole());
  }, [dispatch, id, dataRole]);

  useEffect(() => {
    if (currentRole) {

      const permisoIds = currentRole.permisos.map(
        (p: any) => p._id
      );

      reset({
      _id: currentRole._id,
      nombrerol: currentRole.nombrerol,
      permisos: permisoIds,
    });

    setSelectedPermisos(permisoIds);
      setSubtitulo('Editar');
    } else {
      reset({ _id: 0, nombrerol: '', permisos: [] });
      setSelectedPermisos([]);
      setSubtitulo('Nuevo');
    }
  }, [currentRole, reset]);


  //Agrupar permisos por modulo o tipo 
  const permisosGrouped = useMemo(() => {
    const groups: Record<string, PermisoGroup[]> = {};
    permisos.forEach((p) => {
      const [modulo, ...rest] = p.nombre.split(':');
      const accion = rest.join(':');
      if (!groups[modulo]) groups[modulo] = [];
      groups[modulo].push({ ...p, modulo, accion });
    });
    return groups;
  }, [permisos]);


  interface PermisoGroup {
    _id: number;
    nombre: string;
    modulo: string;
    accion: string;
  }

  const handleTogglePermiso = (permisoId: number) => {
    setSelectedPermisos((prev) =>
      prev.includes(permisoId)
        ? prev.filter((id) => id !== permisoId)
        : [...prev, permisoId]
    );
  };

  const onSubmit = async (data: RoleForm) => {
    setLoading(true);
    try {
      const payload: RoleForm = {
        ...data,
        permisos: selectedPermisos,
      };

      if (currentRole) {
        payload._id = currentRole._id;
        await updateRoleMutation.mutateAsync(payload);
        toast.success('Rol actualizado exitosamente');
      } else {
        await createRoleMutation.mutateAsync(payload);
        toast.success('Rol creado exitosamente');
      }
      navigate(`/private/${PrivateRoutes.ROL}`, { replace: true });
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      {loading && <Loading loading />}

      <CardForm titulo='Rol' subtitulo={subtitulo}>
        <LoadMask />
        <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className='section'>
            <FormInputText
              name="nombrerol"
              control={control}
              label="Nombre del Rol"
              rules={{ required: 'El nombre del rol es requerido' }}
            />
          </div>

          <div className='section'>
            <FormLabel component="legend">Permisos</FormLabel>
            {isLoadingPermisos ? (
              <Loading loading />
            ) : (
              Object.entries(permisosGrouped).map(([modulo, perms]) => (
                <div key={modulo} className='permiso-group'>
                  <FormLabel component="legend" className='permiso-modulo'>
                    {modulo.charAt(0).toUpperCase() + modulo.slice(1)}
                  </FormLabel>
                  <FormGroup row>
                    {perms.map((perm) => (
                      <FormControlLabel
                        key={perm._id}
                        control={
                          <Checkbox
                            checked={selectedPermisos.includes(perm._id)}
                            onChange={() => handleTogglePermiso(perm._id)}
                          />
                        }
                        label={perm.accion}
                      />
                    ))}
                  </FormGroup>
                </div>
              ))
            )}
          </div>

          <div className='container_button'>
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
              Guardar
            </Button>
            <Button
              variant="contained"
              type="button"
              sx={{ mt: 2 }}
              color="error"
              onClick={() => navigate('/private/rol')}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  );
};

export default RoleCreate;
