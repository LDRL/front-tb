export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Company{
  id: number;
  name: string;
  address: string;
  phone: number;
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  branchId: number;
  image?: string | null;
  roles: Role[];
  company: Company;
}


export interface AuthState {
  token: string;
  user: AuthUser;
}

export const EmptyAuthState: AuthState = {
  token: "",

  user: {
    id: 0,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    branchId: 0,
    roles: [],
    company: {
      id:0,
      name: "",
      address: "",
      phone: 0
    }
  }
};