import { CategoryTable } from "./components";
import { Header } from "./components/Header";

export default function Category(){
    //const sidebarState = useSelector((store: AppStore) => store.sidebar)

    return(
        <div>

            <div>
                <h2>Listado de categorías</h2>
                <hr />
            </div>

            <div className="" style={{marginBottom:"10px", marginTop:"10px"}}>
                <Header /> 
            </div>
            
            {/* 94 */}
            <div>
                <CategoryTable />
            </div>
        </div>

    )
}