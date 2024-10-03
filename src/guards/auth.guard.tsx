import Header from "@/components/Header/Header";
import Sidebar from "@/components/SideBar/SideBar";
import { PublicRoutes } from "@/models";
import { AppStore, store } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import styles from "./auth.module.css"
import { useState } from "react";
import { createSidebar } from "@/redux/sidebar";


export const AuthGuard = () => {
    const dispatch = useDispatch();

    const userState = useSelector((store: AppStore) => store.user);
    // const sidebarState = useSelector((store: AppStore) => store.sidebar)
    // const [sidebarOpen, setSidebarOpen] = useState(false);

    return userState.name ?  (
        <div className={styles.custom_bg_gray}>
            {/* <Header /> */}
            <Sidebar
                // state={sidebarState.state}
                // setState={() => dispatch(createSidebar(!sidebarState.state))}
            />

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