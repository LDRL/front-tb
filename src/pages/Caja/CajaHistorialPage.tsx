import { SesionesTable } from './components';

export default function CajaHistorialPage() {
  return (
    <div>
      <div className="page-title-box">
        <h4>Historial de caja</h4>
      </div>

      <div style={{ margin: '10px' }}>
        <SesionesTable />
      </div>
    </div>
  );
}
