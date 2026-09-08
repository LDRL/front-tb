import { PresentationTable } from "./components";
import { Header } from "./index";

export default function PresentationPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de presentaciones</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <PresentationTable />
            </div>       
        </div>
    )
}