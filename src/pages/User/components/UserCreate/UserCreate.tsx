import React, { useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormAutocompleteAsync, FormInputText } from '@/components';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormLabel} from '@mui/material';
import { useForm } from 'react-hook-form';
import { RootState } from '@/redux/store';
import { PrivateRoutes } from '@/models';
import { useCreateUser, useGetUser, useUpdateUser } from '../../hooks/useUser';
import { clearUser, editUser } from '@/redux/userSlice';
import { toast } from 'react-toastify';



import "./UserCreate.css"
import Loading from '@/components/Loading';
import { UserForm } from '../../models/user.api.type';

import { useFetchRoleOptions, useFetchSucursalOptions } from '@/hooks/useOption';
import { getErrorMessage } from '@/utils/axiosClient';

const UserCreate: React.FC = () => {
  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");


  const navigate = useNavigate();

  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const { control, handleSubmit, reset} = useForm<UserForm>({
    defaultValues: { _id: "", nombre: ''},
  });

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);


  // Llamar al hook aquí
  const { data: roleOptions = [], isLoading: isRoleLoading } = useFetchRoleOptions();
  const { data: sucursalOptions = [], isLoading: isSucursalLoading } = useFetchSucursalOptions();

  const { data} = id ? useGetUser(id) : { data: null };

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (id && data) {
      dispatch(editUser(data));
      return
    }

    dispatch(clearUser())
  }, [dispatch, data]); // Agregar 'data' e 'isError' a las dependencias


  useEffect(() => {
    if (currentUser) {

      const roleIds = currentUser.Roles?.map(
        (p: any) => p._id
      );

      reset(currentUser);
      setSelectedRoles(roleIds ?? []);
      setSubtitulo("Editar")
    } else {
      reset({ _id: "", nombre: ''});
      setSubtitulo("Nuevo")
      setSelectedRoles([]);
    }
  }, [currentUser, reset]);

  const handleToggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  {/** Guardar registro */}
  const onSubmit = async (data: UserForm) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        roles: selectedRoles,
      };

      if (currentUser) {
        await updateUserMutation.mutateAsync(payload);
        toast.success("Usuario actualizado exitosamente");
      } else { // Create a new User
        await createUserMutation.mutateAsync(payload);
        toast.success("Usuario creado exitosamente")
      }
      navigate(`/private/${PrivateRoutes.USER}`, {replace:true})
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
    finally {
      setLoading(false); // Desactiva el loader
    }
  };

  return (    
    <div className='container'>
      {loading && (
        <Loading loading/>
      )}

      <CardForm
        titulo='Usuario'
        subtitulo={subtitulo}
      >
        <LoadMask/>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div className='section'>
            <FormInputText
              name="nombre"
              control={control}
              label="Nombre"
              rules={{ required: 'El nombre es requerido' }}
            />
          </div>

          <div className='section'>
            <FormInputText
              name="apellido"
              control={control}
              label="Apellido"
              rules={{ required: 'El apellido es requerido' }}
            />
          </div>
          <div className='section'>
            <FormInputText
              name="username"
              control={control}
              label="Usuario"
              rules={{ required: 'El usuario es requerido' }}
            />
          </div>
          
          {currentUser && (
            <div className="section">
              <FormInputText
                name="codigoemp"
                control={control}
                label="Código Empleado"
                rules={{ required: "El código de empleado es requerido" }}
              />
            </div>
          )}

          <div className='section'>
            <FormInputText
              name="email"
              control={control}
              label="Correo Electronico"
              rules={{ required: 'El correo electronico es requerido' }}
            />
          </div>
          <div className='section'>
            <FormInputText
              name="password"
              control={control}
              label="Contraseña"
              rules={{ required: !currentUser ?  'La contraseña es requerida' : false }}
              type='password'
            />
          </div>

          <div className='section'>
            <FormAutocompleteAsync
              name="idsucursal"
              control={control}
              label="Sucursal"
              options={sucursalOptions}
              isLoading={isSucursalLoading}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
            />
          </div>

          <div className='section'>
            <FormLabel component="legend">Roles</FormLabel>
            {isRoleLoading ? (
              <Loading loading />
            ) : (
              <FormGroup row>
                {roleOptions.map((perm) => (
                  <FormControlLabel
                    key={perm.value}
                    control={
                      <Checkbox
                        checked={selectedRoles.includes(perm.value)}
                        onChange={() => handleToggleRole(perm.value)}
                      />
                    }
                    label={perm.label}
                  />
                ))}
              </FormGroup>

            )}
          </div>

          <div className='container_button'>
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
            >
              Guardar
            </Button>
            <Button
              variant="contained"
              type="button"
              sx={{ mt: 2 }}
              color='error'
              onClick={() => navigate('/private/user')}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>
  );
};

export default UserCreate;