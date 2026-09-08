import { ProductTable } from "./components";
import { Header } from "./index";

export default function ProductPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de Productos</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <ProductTable />
            </div>       
        </div>
    )
}