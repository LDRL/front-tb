import { UserTable } from "./components";
import { Header } from "./index";

export default function UserPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de usuarios</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <UserTable />
            </div>       
        </div>
    )
}