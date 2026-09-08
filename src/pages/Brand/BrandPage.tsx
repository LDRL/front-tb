import { BrandTable } from "./components";
import { Header } from "./index";

export default function BrandPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de marcas</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <BrandTable />
            </div>       
        </div>
    )
}