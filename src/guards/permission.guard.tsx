import { hasPermission } from "@/modules/auth/helper/auth.helper";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PermissionGuard = ({
  children,
  permission
}: {
  children: JSX.Element;
  permission?: string | string[] | null;
}) => {

  const user = useSelector((state: any) => state.auth.user);

  if (!permission) {
    return children;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];

  const allowed = permissions.some((p) => hasPermission(user, p));

  if (!allowed) {
    return <Navigate to="/403" replace />;
  }

  return children;
};