import { useState } from "react";
import { SupplierTable } from "./components";
import { Header } from "./index";
import { Supplier } from "./models/supplier.domain.type";
import { SupplierFormModal } from "./components/SupplierFormModal";

export default function SupplierPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

  const openCreate = () => {
    setSupplierToEdit(null);
    setModalOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div>
        <div className="page-title-box">
          <h4>Listado de proveedores</h4>
          <Header onCreate={openCreate} />
        </div>
      </div>

      <div className="" style={{ margin: "10px" }}>
        <SupplierTable onEditSupplier={openEdit} />
      </div>

      <SupplierFormModal
        open={modalOpen}
        onClose={closeModal}
        supplier={supplierToEdit}
      />
    </div>
  )
}