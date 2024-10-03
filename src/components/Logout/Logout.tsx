import { PublicRoutes } from "@/models";
import { resetUser, userKey } from "@/redux/user"
import { clearLocalStorage } from "@/utils/localStorage.utility"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    clearLocalStorage(userKey);
    dispatch(resetUser());
    navigate(PublicRoutes.LOGIN, {replace: true})
    
  }


  return <button onClick={logout}> Log Out</button>;
}

export default Logout