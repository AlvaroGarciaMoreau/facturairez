import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import Tabs from '../layout/Tabs';
import InvoiceList from '../invoices/InvoiceList';
import { useInvoices } from '../../hooks/useInvoices';
import InvoiceModal from '../invoices/InvoiceModal';
import InvoicePrint from '../invoices/InvoicePrint';
import OcrModal from '../invoices/OcrModal';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('spain');
  const { invoices, loading, addInvoice, updateInvoice, deleteInvoice } = useInvoices(activeTab);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handleNewInvoiceOcr = () => {
    setIsOcrModalOpen(true);
  };

  const handleOcrExtracted = (data) => {
    setEditingInvoice(data);
    setIsOcrModalOpen(false);
    setIsModalOpen(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDeleteInvoice = async (invoice) => {
    if (window.confirm(`¿Estás seguro de eliminar la factura ${invoice.invoiceNumber}?`)) {
      try {
        await deleteInvoice(invoice.id);
      } catch (err) {
        alert("Error al eliminar la factura.");
      }
    }
  };

  const handleSaveInvoice = async (invoiceData) => {
    try {
      if (editingInvoice && editingInvoice.id) {
        await updateInvoice(editingInvoice.id, invoiceData);
      } else {
        await addInvoice(invoiceData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Error al guardar la factura.");
    }
  };

  const handleViewInvoice = (invoice) => {
    setViewingInvoice(invoice);
  };

  if (viewingInvoice) {
    return (
      <InvoicePrint 
        invoice={viewingInvoice} 
        onClose={() => setViewingInvoice(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNewInvoice={handleNewInvoice} onNewInvoiceOcr={handleNewInvoiceOcr} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <InvoiceList 
          invoices={invoices} 
          loading={loading}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onView={handleViewInvoice}
        />
      </main>

      {isModalOpen && (
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvoice}
          initialData={editingInvoice}
          currentType={activeTab}
        />
      )}

      {isOcrModalOpen && (
        <OcrModal
          isOpen={isOcrModalOpen}
          onClose={() => setIsOcrModalOpen(false)}
          onDataExtracted={handleOcrExtracted}
        />
      )}
    </div>
  );
};

export default Dashboard;
