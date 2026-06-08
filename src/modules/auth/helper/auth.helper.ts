import { AuthUser } from "../models/login.domain.type";

export const hasPermission = (
  user: AuthUser | null,
  permission: string
): boolean => {

  if (!user) return false;

  return (
    user.roles.some(role =>
      role.permissions.some(
        p => p.name === permission
      )
    )
  );
};

export const hasRole = (
  user: AuthUser | null,
  roleName: string
): boolean => {

  if (!user) return false;

  return (
    user.roles.some(
      role => role.name === roleName
    )
  );
};