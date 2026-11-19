import Header from "@/components/Header/Header";
import Sidebar from "@/components/SideBar/SideBar";
import Footer from "@/components/Footer/Footer";
import { PublicRoutes } from "@/models";
import { AppStore } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import styles from "./auth.module.css"

export const AuthGuard = () => {
    const userState = useSelector((store: AppStore) => store.auth);
    
    if (!userState.user?.id) {
    return <Navigate replace to={`/${PublicRoutes.LOGIN}`} />;
  }

   return (
    <div className={styles.custom_bg_gray}>
      <Sidebar />

      <div className={styles.custom_flex_min_h}>
        <Header />
        <main style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AuthGuard;