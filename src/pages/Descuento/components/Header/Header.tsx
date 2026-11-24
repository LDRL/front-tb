import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/models";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/modules/auth/helper/permissions";
import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { can } = usePermission();
  const canCreate = can(PERMISSIONS.DESCUENTOS.CREATE);

  return (
    <div className="header_page">
      <div />
      {canCreate && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/private/${PrivateRoutes.DESCUENTO_CREATE}`)}
          sx={{ borderRadius: 5, display: "flex", justifyContent: "space-between", gap: 1 }}
        >
          <span>+</span> Nuevo Descuento
        </Button>
      )}
    </div>
  );
};

export default Header;
