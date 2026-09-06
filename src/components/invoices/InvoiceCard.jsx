import React from 'react';
import { Pencil, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

const InvoiceCard = ({ invoice, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 cursor-pointer" onClick={() => onView(invoice)}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{invoice.client?.name}</span>
              {invoice.orderNumber && (
                <span className="text-xs text-gray-400">Pedido: {invoice.orderNumber}</span>
              )}
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
              ${
                invoice.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : invoice.status === 'draft'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }
            `}
          >
            {invoice.status || 'issued'}
          </span>
        </div>
        
        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500">
              Fecha: {invoice.issueDate ? format(new Date(invoice.issueDate), 'dd/MM/yyyy') : '-'}
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {invoice.total ? `€${invoice.total.toFixed(2)}` : '€0.00'}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3 border-t border-gray-200">
        <button
          onClick={(e) => { e.stopPropagation(); onView(invoice); }}
          className="text-gray-500 hover:text-blue-600 transition-colors"
          title="Ver detalle e imprimir"
        >
          <FileText className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(invoice); }}
          className="text-gray-500 hover:text-blue-600 transition-colors"
          title="Editar factura"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(invoice); }}
          className="text-gray-500 hover:text-red-600 transition-colors"
          title="Eliminar factura"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;
