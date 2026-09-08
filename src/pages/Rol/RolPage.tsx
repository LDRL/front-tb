import { RoleTable } from "./components";
import { Header } from "./index";

export default function RolPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de roles</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <RoleTable />
            </div>       
        </div>
    )
}