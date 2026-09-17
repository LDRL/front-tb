import { useState } from 'react';
import { UnitTable } from "./components";
import { Header } from "./index";
import { Unit } from './models';
import { UnitFormModal } from './components/UnitFormModal';

export default function UnitPage() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [unitToEdit, setUnitToEdit] = useState<Unit | null>(null);

    const openCreate = () => {
        setUnitToEdit(null);
        setModalOpen(true);
    };

    const openEdit = (unit: Unit) => {
        setUnitToEdit(unit);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <div>
                <div className="page-title-box" style={{ display: "flex", justifyContent: 'space-between' }}>
                    <h4>Listado de unidades de medida</h4>
                    <Header onCreate={openCreate} />
                </div>
            </div>

            <div className="" style={{ margin: '10px' }}>
                <UnitTable onEditUnit={openEdit} />
            </div>

            <UnitFormModal
                open={modalOpen}
                onClose={closeModal}
                unit={unitToEdit}
            />
        </div>
    )
}