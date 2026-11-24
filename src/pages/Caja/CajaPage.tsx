import { useState } from 'react';
import { Caja } from './models';
import { CajaFormModal, CajaTable, Header, SesionActual } from './components';

export default function CajaPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cajaToEdit, setCajaToEdit] = useState<Caja | null>(null);
  const [selectedCaja, setSelectedCaja] = useState<Caja | null>(null);

  const openCreate = () => {
    setCajaToEdit(null);
    setModalOpen(true);
  };

  const openEdit = (caja: Caja) => {
    setCajaToEdit(caja);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div className="page-title-box">
        <h4>Sesión de caja</h4>
        <Header onCreate={openCreate} />
      </div>

      <div style={{ margin: '10px' }}>
        <SesionActual selectedCaja={selectedCaja} />
        <CajaTable
          onEdit={openEdit}
          onOpenSession={(caja) => setSelectedCaja(caja)}
        />
      </div>

      <CajaFormModal
        open={modalOpen}
        onClose={closeModal}
        caja={cajaToEdit}
      />
    </div>
  );
}
