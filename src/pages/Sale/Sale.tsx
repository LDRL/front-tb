import { useSelector } from "react-redux";
import { AppStore } from "@/redux/store";
import { SaleTable } from "./components/SaleTable";
import { Header } from "./components/Header";


export default function Sale(){
    const sidebarState = useSelector((store: AppStore) => store.sidebar)
    
    return(
        <div>
            <div>
                <h2>Listado de ventas</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px", marginTop:"10px", marginRight: "20px"}}>
                <Header /> 
            </div>
            
            {/* 94 */}
            <div style={{width:  sidebarState.state ? "86vw" : "94vw"}}>
                <SaleTable />
            </div>
        </div>
    )
}