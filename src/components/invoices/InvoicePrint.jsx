import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { format } from 'date-fns';
import logo from '../../assets/logo.jpeg';

const InvoicePrint = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!invoice) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white">
      {/* Controles no imprimibles */}
      <div className="max-w-4xl mx-auto mb-6 px-4 print:hidden flex justify-between items-center">
        <button 
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </button>
        <button 
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Factura
        </button>
      </div>

      {/* Contenedor de la Factura DIN-A4 */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print-container">
        <div className="p-10 sm:p-16">
          {/* Cabecera */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
            <div className="flex-1">
              <img src={logo} alt="Logo" className="h-20 w-auto mb-4" />
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-light text-gray-900 mb-2 uppercase tracking-wider">Factura</h1>
              <p className="text-lg font-medium text-gray-900">{invoice.invoiceNumber}</p>
              {invoice.orderNumber && (
                <p className="text-sm text-gray-600">Pedido: {invoice.orderNumber}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                <p>Fecha de Emisión: {invoice.issueDate ? format(new Date(invoice.issueDate), 'dd/MM/yyyy') : ''}</p>
                <p>Fecha de Operación: {invoice.supplyDate ? format(new Date(invoice.supplyDate), 'dd/MM/yyyy') : ''}</p>
              </div>
            </div>
          </div>

          {/* Entidades */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Emisor</h2>
              <div className="text-sm text-gray-900 space-y-1">
                <p className="font-bold text-base">{invoice.issuer?.name}</p>
                {invoice.issuer?.tradeName && <p>{invoice.issuer?.tradeName}</p>}
                <p>NIF: {invoice.issuer?.taxId}</p>
                <p>{invoice.issuer?.address}</p>
                <p>{invoice.issuer?.postalCode} {invoice.issuer?.city}</p>
                <p>{invoice.issuer?.province}, {invoice.issuer?.country}</p>
                <p>{invoice.issuer?.email}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Cliente</h2>
              <div className="text-sm text-gray-900 space-y-1">
                <p className="font-bold text-base">{invoice.client?.name}</p>
                {invoice.client?.taxId && <p>CIF/NIF/VAT: {invoice.client?.taxId}</p>}
                <p>{invoice.client?.address}</p>
                <p>{invoice.client?.postalCode} {invoice.client?.city}</p>
                <p>{invoice.client?.province}, {invoice.client?.country}</p>
                {invoice.client?.email && <p>{invoice.client?.email}</p>}
              </div>
            </div>
          </div>

          {/* Tabla de Conceptos */}
          <div className="mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 text-sm font-semibold text-gray-900">
                  <th className="py-3 px-2">Descripción</th>
                  <th className="py-3 px-2 text-right">Cant.</th>
                  <th className="py-3 px-2 text-right">Precio Ud.</th>
                  <th className="py-3 px-2 text-right">IVA %</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {invoice.items?.map((item, i) => (
                  <tr key={item.id || i} className="border-b border-gray-200">
                    <td className="py-3 px-2">{item.description}</td>
                    <td className="py-3 px-2 text-right">{item.quantity}</td>
                    <td className="py-3 px-2 text-right">€{Number(item.unitPrice).toFixed(2)}</td>
                    <td className="py-3 px-2 text-right">{invoice.type === 'spain' ? item.vatRate : 0}%</td>
                    <td className="py-3 px-2 text-right font-medium">€{Number(item.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales y Notas */}
          <div className="flex justify-between items-start">
            <div className="w-1/2 pr-8 text-sm text-gray-600">
              {invoice.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-1">Notas:</h3>
                  <p className="whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
              {invoice.type === 'europe' && (
                <p className="italic border-l-2 border-gray-300 pl-3">
                  Operación intracomunitaria exenta de IVA por inversión del sujeto pasivo.
                </p>
              )}
              {invoice.type === 'world' && (
                <p className="italic border-l-2 border-gray-300 pl-3">
                  Exportación exenta de IVA.
                </p>
              )}
            </div>
            
            <div className="w-1/2 sm:w-1/3">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-medium">Subtotal</td>
                    <td className="py-2 text-right text-gray-900">€{Number(invoice.subtotal).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600 font-medium">IVA Total</td>
                    <td className="py-2 text-right text-gray-900">€{Number(invoice.vatTotal).toFixed(2)}</td>
                  </tr>
                  {invoice.irpfTotal > 0 && (
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-600 font-medium">Retención IRPF ({invoice.irpfRate}%)</td>
                      <td className="py-2 text-right text-red-600">-€{Number(invoice.irpfTotal).toFixed(2)}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-4 text-base font-bold text-gray-900">Total a Pagar</td>
                    <td className="py-4 text-right text-xl font-bold text-gray-900">€{Number(invoice.total).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-16 text-center text-xs text-gray-500 border-t border-gray-200 pt-8">
            <p>Factura generada por Facturairez</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
