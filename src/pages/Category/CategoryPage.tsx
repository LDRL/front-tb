import { CategoryTable } from "./components";
import { Header } from "./index";

export default function CategoryPage(){    
    return(
        <div>
            <div>
                <div className="page-title-box" style={{display:"flex", justifyContent:'space-between'}}>
                    <h4>Listado de categorías</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <CategoryTable />
            </div>       
        </div>
    )
}