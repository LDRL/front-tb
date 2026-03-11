import { PublicRoutes } from "@/models";
import { logout, userKey } from "@/redux/user"
import { clearLocalStorage } from "@/utils/localStorage.utility"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Logout.css"

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    clearLocalStorage(userKey);
    dispatch(logout());
    navigate(PublicRoutes.LOGIN, {replace: true})
    
  }


  return <button onClick={handleLogout} className="btn-logout"> Cerrar Sessión</button>;
}

export default Logout