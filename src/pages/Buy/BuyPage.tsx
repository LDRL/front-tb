import { BuyTable } from "./components";
import { Header } from "./index";

export default function BuyPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de compras</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <BuyTable />
            </div>       
        </div>
    )
}