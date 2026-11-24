import { Header } from "./components/Header";
import { DescuentoTable } from "./components/DescuentoTable";

export default function DescuentoPage() {
  return (
    <div>
      <div className="page-title-box">
        <h4>Listado de descuentos</h4>
        <Header />
      </div>

      <div style={{ margin: "10px" }}>
        <DescuentoTable />
      </div>
    </div>
  );
}
