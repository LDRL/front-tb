import { useState } from 'react';
import { TallaTable } from './components';
import { Header } from './components/Header';
import { Talla } from './models';
import { TallaFormModal } from './components/TallaFormModal';

export default function TallaPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [tallaToEdit, setTallaToEdit] = useState<Talla | null>(null);

  const openCreate = () => {
    setTallaToEdit(null);
    setModalOpen(true);
  };

  const openEdit = (talla: Talla) => {
    setTallaToEdit(talla);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div>
        <div className="page-title-box">
          <h4>Listado de tallas</h4>
          <Header onCreate={openCreate} />
        </div>
      </div>

      <div style={{ margin: '10px' }}>
        <TallaTable onEditTalla={openEdit} />
      </div>

      <TallaFormModal open={modalOpen} onClose={closeModal} talla={tallaToEdit} />
    </div>
  );
}
