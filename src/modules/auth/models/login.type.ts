import { User } from "@/pages/User";


export interface AuthState {
  token: string;
  usuario: User;
}

export const EmptyUserState: AuthState = {
  token: "",
  usuario: {
    _id: "",
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    idsucursal:0
  }
 
};

export interface LoginResponse {
  ok: boolean;
  message: string;
  data : AuthState
  meta: null;
  
}


export interface LoginData {
  email: string;
  password: string;
}