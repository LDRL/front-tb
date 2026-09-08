import { ClientTable } from "./components";
import { Header } from "./index";

export default function ClientPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de clientes</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <ClientTable />
            </div>       
        </div>
    )
}