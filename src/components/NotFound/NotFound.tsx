import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">404</h1>
        <h2 className="not-found__title">Página no encontrada</h2>
        <p className="not-found__text">
          La ruta a la que intentas acceder no existe.
        </p>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
