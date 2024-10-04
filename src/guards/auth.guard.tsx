import Header from "@/components/Header/Header";
import Sidebar from "@/components/SideBar/SideBar";
import { PublicRoutes } from "@/models";
import { AppStore } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import styles from "./auth.module.css"
export const AuthGuard = () => {
    const userState = useSelector((store: AppStore) => store.user);

    return userState.name ?  (
        <div className={styles.custom_bg_gray}>
            <Sidebar />

            <div className={styles.custom_flex_min_h}>
                <Header />
                <main className={styles.custom_padding_flex}>
                    <Outlet />
                </main>
            </div>
        </div>
    ) : <Navigate replace to = {PublicRoutes.LOGIN} />
}

export default AuthGuard;