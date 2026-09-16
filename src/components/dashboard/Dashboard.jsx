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
  const [selectedYear, setSelectedYear] = useState('2026');
  const years = ['2026', '2027', '2028', '2029', '2030'];

  const { invoices, loading, addInvoice, updateInvoice, deleteInvoice } = useInvoices(activeTab);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const filteredInvoices = invoices
    .filter(inv => {
      if (!inv.issueDate) return false;
      return inv.issueDate.startsWith(selectedYear);
    })
    .sort((a, b) => {
      const getNum = (inv) => {
        if (inv.orderNumber) {
          const match = String(inv.orderNumber).match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        }
        return 0;
      };
      
      const numA = getNum(a);
      const numB = getNum(b);
      
      if (numA !== numB) {
        return numB - numA; // Descending
      }
      return new Date(b.issueDate || 0) - new Date(a.issueDate || 0);
    });

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-4 sm:mt-0 flex items-center bg-white border border-gray-300 rounded-md shadow-sm">
            <label htmlFor="year-select" className="pl-3 pr-2 py-2 text-sm text-gray-600 font-medium border-r border-gray-200">
              Año:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border-0 focus:ring-0 text-sm font-semibold text-gray-900 py-2 pl-3 pr-8 rounded-r-md cursor-pointer outline-none bg-transparent"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        
        <InvoiceList 
          invoices={filteredInvoices} 
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
