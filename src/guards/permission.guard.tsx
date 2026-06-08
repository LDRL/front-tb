import { hasPermission } from "@/modules/auth/helper/auth.helper";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PermissionGuard = ({
  children,
  permission
}: {
  children: JSX.Element;
  permission: string;
}) => {

  const user = useSelector((state: any) => state.auth.user);

  const allowed = hasPermission(user, permission);

  if (!allowed) {
    return <Navigate to="/403" replace />;
  }

  return children;
};