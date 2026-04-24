import { FormInputText } from "@/components";
import { PrivateRoutes } from "@/models";
import { createSidebar } from "@/redux/sidebar";
import { login} from "@/redux/user";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import './Login.css'
import LoadMask from "@/components/LoadMask/LoadMask";
import { Box, Button } from "@mui/material";
import { useLoginMutation } from "@/modules/auth/hooks/useLogin";
import { LoginData } from "@/modules/auth/models/login.type";

import { toast } from 'react-toastify';


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<LoginData>({
      defaultValues: { email: '', password: '' },
  });

  const mutationLogin = useLoginMutation();

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await mutationLogin.mutateAsync(data);
      dispatch(login({
        token: res.data.token,
        usuario: res.data.usuario
      }));      
      dispatch(createSidebar({state: false}))

      // Redirigir a ruta privada
      navigate(`/${PrivateRoutes.PRIVATE}`, { replace: true });

    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Error desconocido");
      } else {
        toast.error(error.message || "Error desconocido");
      }
    }
  };
  
  return (
    <>
      <div className='screen'>
          <div className='screen__content'>
              <h1 className='form-title'>
                  Iniciar sesión
              </h1>

              <LoadMask />


              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
              >

                <div className="form-signin__content">
                      <label className="form-signin__text"
                          htmlFor="email">
                          Usuario
                      </label>
                      <FormInputText
                        name="email"
                        label="email"
                        control={control}
                        rules={{ required: 'Correo electronico es requerido' }}
                      />
                  </div>

                  <div className="form-signin__content">
                      <label className="form-signin__text"
                          htmlFor="password">
                          Contraseña
                      </label>
                      <FormInputText
                      name="password"
                      label="Contraseña"
                      control={control}
                      rules={{required: 'La contraseña es requerida'}}
                      type="password"
                      />
                  </div>

                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ mt: 2 }}
                  >
                    Iniciar Sesión
                  </Button>
              </Box>

              <nav className="nav">
                  <Link
                      className="nav__link"
                      to="olvide-password">
                      Olvide mi contraseña
                  </Link>
              </nav>

          </div>
      </div>
  </>
  )
}
