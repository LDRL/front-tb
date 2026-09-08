import { SaleTable } from "./components";
import { Header } from "./index";

export default function SalePage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de ventas</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <SaleTable />
            </div>       
        </div>
    )
}