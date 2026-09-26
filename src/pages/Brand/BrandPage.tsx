import { useState } from 'react';
import { BrandTable } from "./components";
import { Header } from "./index";
import { Brand } from './models';
import { BrandFormModal } from './components/BrandFormModal';

export default function BrandPage() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);

    const openCreate = () => {
        setBrandToEdit(null);
        setModalOpen(true);
    };

    const openEdit = (brand: Brand) => {
        setBrandToEdit(brand);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <div>
                <div className="page-title-box">
                    <h4>Listado de marcas</h4>
                    <Header onCreate={openCreate} />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <BrandTable onEditBrand={openEdit} />
            </div>

            <BrandFormModal
                open={modalOpen}
                onClose={closeModal}
                brand={brandToEdit}
            />
        </div>
    )
}