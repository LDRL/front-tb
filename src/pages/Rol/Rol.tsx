import { useSelector } from "react-redux";
import { RoleTable } from "./components";
import { Header } from "./components/Header";
import { AppStore } from "@/redux/store";

export default function Rol() {
    const sidebarState = useSelector((store: AppStore) => store.sidebar);

    return (
        <div>
            <div>
                <h2>Listado de roles</h2>
                <hr />
            </div>

            <div style={{ marginBottom: "10px", marginTop: "10px", marginRight: "20px" }}>
                <Header />
            </div>

            <div style={{ width: sidebarState.state ? "86vw" : "94vw" }}>
                <RoleTable />
            </div>
        </div>
    );
}
