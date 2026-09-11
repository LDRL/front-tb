import { UnitTable } from "./components";
import { Header } from "./index";

export default function UnitPage() {
    return (
        <div>
            <div>
                <div className="page-title-box" style={{ display: "flex", justifyContent: 'space-between' }}>
                    <h4>Listado de unidades de medida</h4>
                    <Header />
                </div>
            </div>

            <div className="" style={{ margin: '10px' }}>
                <UnitTable />
            </div>
        </div>
    )
}