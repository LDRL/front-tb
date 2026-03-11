import React, { useEffect, useState } from 'react';
import CardForm from '../../../../components/Cards/CardForm'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadMask from '@/components/LoadMask/LoadMask';
import { FormInputText } from '@/components';
import { Box, Button} from '@mui/material';
import { useForm } from 'react-hook-form';
import { RootState } from '@/redux/store';
import { User } from '../../models';
import { PrivateRoutes, PublicRoutes } from '@/models';
import { useCreateUser, useGetUser, useUpdateUser } from '../../hooks/useUser';
import { clearUser, editUser } from '@/redux/userSlice';
import { toast } from 'react-toastify';



import "./UserCreate.css"
import Loading from '@/components/Loading';

const UserCreate: React.FC = () => {
  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const navigate = useNavigate();

  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const { control, handleSubmit, reset} = useForm<User>({
    defaultValues: { _id: "", nombre: ''},
  });


 // Llamar al hook aquí
 const { data, isLoading, isError } = id ? useGetUser(id) : { data: null, isLoading: false, isError: false };

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
      reset(currentUser);
      setSubtitulo("Editar")
    } else {
      reset({ _id: "", nombre: ''});
      setSubtitulo("Nuevo")
    }
  }, [currentUser, reset]);


  const onSubmit = async (data: User) => {
    setLoading(true);
    try {
      if (currentUser) {
        await updateUserMutation.mutateAsync(data);
        toast.success("Usuario actualizado exitosamente");
      } else { // Create a new User
        await createUserMutation.mutateAsync(data);
        toast.success("Usuario creado exitosamente")
      }
      navigate(`/private/${PrivateRoutes.USER}`, {replace:true})
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Error desconocido");
      } else {
        toast.error(error.message || "Error desconocido");
      }
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