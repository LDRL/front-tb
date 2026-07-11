import { ProductTable } from "./components";
import { Header } from "./index";

export default function ProductPage(){
    //const sidebarState = useSelector((store: AppStore) => store.sidebar)
    
    return(
        <div>
            <div>
                <h2>Listado de productos</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px", marginTop:"10px"}}>
                <Header />
            </div>
            
            <ProductTable />
        </div>
    )
}