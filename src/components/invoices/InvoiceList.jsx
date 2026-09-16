import React from 'react';
import InvoiceCard from './InvoiceCard';

const InvoiceList = ({ invoices, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
        <p className="text-gray-500">No hay facturas en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default InvoiceList;
