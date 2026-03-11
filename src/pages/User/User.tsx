import { useSelector } from "react-redux";
import { UserTable } from "./components";
import { Header } from "./components/Header";
import { AppStore } from "@/redux/store";

export default function User(){
    const sidebarState = useSelector((store: AppStore) => store.sidebar)

    return(
        <div>

            <div>
                <h2>Listado de usuarios</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px", marginTop:"10px", marginRight: "20px"}}>
                <Header /> 
            </div>
            
            {/* 94 */}
            <div style={{width:  sidebarState.state ? "86vw" : "94vw"}}>
                <UserTable />
            </div>
        </div>

    )
}