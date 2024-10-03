import { ProductTable } from "./components";
import { CustomDialog } from "@/components/CustomDialog";
import { ProductModal, Header } from "./index";
import { useSelector } from "react-redux";
import { AppStore } from "@/redux/store";


export default function Productt(){
    const sidebarState = useSelector((store: AppStore) => store.sidebar)
    
    return(
        <div>

            <CustomDialog>
                <ProductModal />
            </CustomDialog>

            <div>
                <h2>Listado de productos</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px"}}>
                <Header />
            </div>
            

            <div style={{width:  sidebarState.state ? "84vw" : "92vw"}}>
                <ProductTable />
            </div>
        </div>

    )
}