import { PrivateRoutes, PublicRoutes } from "@/models";
import { createSidebar } from "@/redux/sidebar";
import { createUser, resetUser, userKey } from "@/redux/user";
import { clearLocalStorage } from "@/utils/localStorage.utility";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    clearLocalStorage(userKey);
    dispatch(resetUser());
    navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
  },[])


  const login = () => {
    dispatch(createSidebar({state: false}))
    dispatch(createUser({id:1, name:"Luis", email:"ffff"}))
    navigate(`/${PrivateRoutes.PRIVATE}`, {replace:true});
  }
  
  return (
    <div>
      <h2>Este es el login</h2>
      <button onClick={login}>Login</button>
    </div>
  )
}
