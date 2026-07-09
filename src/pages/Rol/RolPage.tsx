import { RoleTable } from "./components";
import { Header } from "./components/Header";

export default function RolPage() {

    return (
        <div>
            <div>
                <h2>Listado de roles</h2>
                <hr />
            </div>

            <div style={{ marginBottom: "10px", marginTop: "10px", marginRight: "20px" }}>
                <Header />
            </div>

            <div>
                <RoleTable />
            </div>
        </div>
    );
}
