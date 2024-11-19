import { CustomDialog } from "@/components/CustomDialog";
import { useSelector } from "react-redux";
import { AppStore } from "@/redux/store";
import { BuyTable } from "./components/BuyTable";
import { Header } from "./components/Header";


export default function Buy(){
    const sidebarState = useSelector((store: AppStore) => store.sidebar)
    
    return(
        <div>
            <div>
                <h2>Listado de compras</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px", marginTop:"10px", marginRight: "20px"}}>
                <Header /> 
            </div>
            
            {/* 94 */}
            <div style={{width:  sidebarState.state ? "86vw" : "94vw"}}>
                <BuyTable />
            </div>
        </div>
    )
}