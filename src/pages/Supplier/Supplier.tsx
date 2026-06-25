import { SupplierTable } from "./components";
import { Header } from "./components/Header";

export default function Supplier(){
    return(
        <div>

            <div>
                <h2>Listado de proveedores</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px", marginTop:"10px", marginRight: "20px"}}>
                <Header /> 
            </div>
            
            {/* 94 */}
            <div>
                <SupplierTable />
            </div>
        </div>

    )
}