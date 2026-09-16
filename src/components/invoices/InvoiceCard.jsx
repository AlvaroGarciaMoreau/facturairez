import React from 'react';
import { Pencil, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

const InvoiceCard = ({ invoice, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row items-stretch">
      
      <div className="p-4 sm:p-5 flex-1 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4" onClick={() => onView(invoice)}>
        
        {/* Info principal */}
        <div className="flex items-center gap-4 min-w-[200px] flex-1">
          <div className="bg-blue-50 text-blue-700 p-2 sm:p-3 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pedido</span>
            <span className="text-lg font-black">{invoice.orderNumber || '-'}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">
              {!/^(ES-|EUR-|INT-)/.test(invoice.invoiceNumber) && invoice.invoiceNumber
                ? (invoice.type === 'spain' ? 'ES-' : invoice.type === 'europe' ? 'EUR-' : 'INT-') + invoice.invoiceNumber 
                : invoice.invoiceNumber || 'Borrador'}
            </h3>
            <p className="text-base font-semibold text-gray-900 truncate max-w-[250px]">{invoice.client?.name || 'Sin nombre'}</p>
          </div>
        </div>

        {/* Fecha y Estado */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 w-full sm:w-auto">
          <span className="text-sm text-gray-500 font-medium">
            {invoice.issueDate ? format(new Date(invoice.issueDate), 'dd/MM/yyyy') : '-'}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-bold capitalize
            ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}
          `}>
            {(!invoice.status || invoice.status === 'issued') ? 'Emitida' : invoice.status === 'draft' ? 'Borrador' : invoice.status === 'paid' ? 'Pagada' : invoice.status}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-end min-w-[120px] ml-auto">
          <p className="text-xl font-bold text-gray-900">
            {invoice.total ? `€${invoice.total.toFixed(2)}` : '€0.00'}
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="bg-gray-50 px-4 py-3 sm:py-0 sm:w-16 flex flex-row sm:flex-col justify-end sm:justify-center items-center gap-2 sm:gap-4 border-t sm:border-t-0 sm:border-l border-gray-200">
        <button onClick={(e) => { e.stopPropagation(); onView(invoice); }} className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Ver e imprimir">
          <FileText className="h-5 w-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onEdit(invoice); }} className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Editar">
          <Pencil className="h-5 w-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(invoice); }} className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Eliminar">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

    </div>
  );
};

export default InvoiceCard;
