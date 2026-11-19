import { useState } from 'react';
import { ColorTable } from './components';
import { Header } from './components/Header';
import { Color } from './models';
import { ColorFormModal } from './components/ColorFormModal';

export default function ColorPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [colorToEdit, setColorToEdit] = useState<Color | null>(null);

  const openCreate = () => {
    setColorToEdit(null);
    setModalOpen(true);
  };

  const openEdit = (color: Color) => {
    setColorToEdit(color);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div>
        <div className="page-title-box">
          <h4>Listado de colores</h4>
          <Header onCreate={openCreate} />
        </div>
      </div>

      <div style={{ margin: '10px' }}>
        <ColorTable onEditColor={openEdit} />
      </div>

      <ColorFormModal open={modalOpen} onClose={closeModal} color={colorToEdit} />
    </div>
  );
}
