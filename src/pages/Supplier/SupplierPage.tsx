import { SupplierTable } from "./components";
import { Header } from "./index";

export default function SupplierPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de proveedores</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <SupplierTable />
            </div>       
        </div>
    )
}