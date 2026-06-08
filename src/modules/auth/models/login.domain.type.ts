export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  branchId: number;
  roles: Role[];
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
    roles: []
  }
};