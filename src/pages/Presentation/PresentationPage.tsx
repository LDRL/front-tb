import { useState } from 'react';
import { PresentationTable } from "./components";
import { Header } from "./index";
import { Presentation } from './models';
import { PresentationFormModal } from './components/PresentationFormModal';

export default function PresentationPage() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [presentationToEdit, setPresentationToEdit] = useState<Presentation | null>(null);

    const openCreate = () => {
        setPresentationToEdit(null);
        setModalOpen(true);
    };

    const openEdit = (presentation: Presentation) => {
        setPresentationToEdit(presentation);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <div>
                <div className="page-title-box">
                    <h4>Listado de presentaciones</h4>
                    <Header onCreate={openCreate} />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <PresentationTable onEditPresentation={openEdit} />
            </div>

            <PresentationFormModal
                open={modalOpen}
                onClose={closeModal}
                presentation={presentationToEdit}
            />
        </div>
    )
}