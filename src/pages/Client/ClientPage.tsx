import { ClientTable } from "./components";
import { Header } from "./components/Header";

export default function ClientPage() {
    return (
        <div>
            <div>
                <h2>Listado de clientes</h2>
                <hr />
            </div>

            <div
                className=""
                style={{
                    marginBottom: "10px",
                    marginTop: "10px",
                    marginRight: "20px",
                }}
            >
                <Header />
            </div>

            <div>
                <ClientTable />
            </div>
        </div>
    );
}
