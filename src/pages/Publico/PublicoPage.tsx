import { useState } from 'react';
import { PublicoTable } from './components';
import { Header } from './components/Header';
import { Publico } from './models';
import { PublicoFormModal } from './components/PublicoFormModal';

export default function PublicoPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [publicoToEdit, setPublicoToEdit] = useState<Publico | null>(null);

  const openCreate = () => {
    setPublicoToEdit(null);
    setModalOpen(true);
  };

  const openEdit = (publico: Publico) => {
    setPublicoToEdit(publico);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div>
        <div className="page-title-box">
          <h4>Listado de públicos</h4>
          <Header onCreate={openCreate} />
        </div>
      </div>

      <div style={{ margin: '10px' }}>
        <PublicoTable onEditPublico={openEdit} />
      </div>

      <PublicoFormModal open={modalOpen} onClose={closeModal} publico={publicoToEdit} />
    </div>
  );
}
