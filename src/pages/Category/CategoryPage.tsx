import { useState } from 'react';
import { CategoryTable } from "./components";
import { Header } from "./index";
import { Category } from './models';
import { CategoryFormModal } from './components/CategoryFormModal';

export default function CategoryPage() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    const openCreate = () => {
        setCategoryToEdit(null);
        setModalOpen(true);
    };

    const openEdit = (category: Category) => {
        setCategoryToEdit(category);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <div>
                <div className="page-title-box">
                    <h4>Listado de categorías</h4>
                    <Header onCreate={openCreate} />
                </div>
            </div>

            <div className="" style={{margin:'10px'}}>
                <CategoryTable onEditCategory={openEdit} />
            </div>

            <CategoryFormModal
                open={modalOpen}
                onClose={closeModal}
                category={categoryToEdit}
            />
        </div>
    )
}