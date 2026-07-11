
import { SaleTable } from "./components/SaleTable";
import { Header } from "./components/Header";

export default function SalePage(){    
    return(
        <div>
            <div>
                <h2>Listado de ventas</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px", marginTop:"10px"}}>
                <Header /> 
            </div>
            
            {/* 94 */}
            <div >
                <SaleTable />
            </div>
        </div>
    )
}