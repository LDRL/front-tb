
import { UserTable } from "./components";
import { Header } from "./components/Header";

export default function User(){
 

    return(
        <div>

            <div>
                <h2>Listado de usuarios</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px", marginTop:"10px", marginRight: "20px"}}>
                <Header /> 
            </div>
            
            {/* 94 */}
            <div>
                <UserTable />
            </div>
        </div>

    )
}