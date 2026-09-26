import { useState } from "react";
import { ClientTable } from "./components";
import { Header } from "./index";
import { Client } from "./models";
import { ClientFormModal } from "./components/ClientFormModal";

export default function ClientPage() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

    const openCreate = () => {
        setClientToEdit(null);
        setModalOpen(true);
    };

    const openEdit = (client: Client) => {
        setClientToEdit(client);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <div>
                <div className="page-title-box">
                    <h4>Listado de clientes</h4>
                    <Header onCreate={openCreate} />
                </div>
            </div>

            <div className="" style={{ margin: "10px" }}>
                <ClientTable onEditClient={openEdit} />
            </div>

            <ClientFormModal
                open={modalOpen}
                onClose={closeModal}
                client={clientToEdit}
            />
        </div>
    )
}