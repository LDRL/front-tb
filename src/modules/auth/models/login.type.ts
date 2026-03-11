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
  }
};

export interface LoginResponse {
  token: string;
  usuario: User;
}

export interface LoginData {
  email: string;
  password: string;
}