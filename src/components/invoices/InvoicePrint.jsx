import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import logo from '../../assets/logo.jpeg';

const InvoicePrint = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!invoice) return null;

  // Determine header color and text based on type
  let headerColor = "bg-red-400"; // Default Spain
  let typeLabel = "España";
  
  if (invoice.type === 'europe') {
    headerColor = "bg-[#43a1f6]"; // Blue
    typeLabel = "Europa";
  } else if (invoice.type === 'world') {
    headerColor = "bg-[#8eb69b]"; // Green
    typeLabel = "Internacional";
  }

  const billing = invoice.sameAsShipping ? (invoice.shippingDetails || {}) : invoice.client;
  const shipping = invoice.shippingDetails || {};
  const issuer = invoice.issuer || {
    name: "Edith Pérez Bella",
    tradeName: "Irez Crochet",
    taxId: "ES42308938R",
    address: "Avenida de Molière 4, Apartado N°14013",
    postalCode: "29004",
    city: "Málaga",
    province: "Málaga",
    country: "España",
    email: "irezcrochet@gmail.com"
  };

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
          {/* Cabecera Tipo Template */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 flex items-center">
              <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mr-2">FACTURA</h1>
              <span className="text-2xl text-gray-600">{typeLabel}</span>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={logo} alt="Logo" className="h-16 w-auto" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-bold text-gray-800">Nº de factura</p>
              <p className="text-xl text-gray-700">
                {!/^(ES-|EUR-|INT-)/.test(invoice.invoiceNumber) && invoice.invoiceNumber
                  ? (invoice.type === 'spain' ? 'ES-' : invoice.type === 'europe' ? 'EUR-' : 'INT-') + invoice.invoiceNumber 
                  : invoice.invoiceNumber}
              </p>
            </div>
          </div>

          {/* Barra de color y fechas */}
          <div className="flex mb-10 w-full">
            <div className={`w-1/2 h-16 ${headerColor}`}></div>
            <div className="w-1/2 h-16 bg-gray-100 flex flex-col justify-center items-end pr-6 text-sm font-medium text-gray-800">
              <p>Fecha de emisión: {invoice.issueDate ? format(new Date(invoice.issueDate), 'd \'de\' MMMM \'de\' yyyy', { locale: es }) : ''}</p>
              <p>Fecha de suministro: {invoice.supplyDate ? format(new Date(invoice.supplyDate), 'd \'de\' MMMM \'de\' yyyy', { locale: es }) : ''}</p>
            </div>
          </div>

          {/* Entidades */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-2">Facturar a</h2>
              <div className="text-sm text-gray-800 space-y-1">
                <p>{billing?.name}</p>
                {billing?.taxId && <p>NIF/CIF: {billing?.taxId}</p>}
                <p>{billing?.address}</p>
                <p>{billing?.postalCode} {billing?.city}</p>
                <p>{billing?.province ? `${billing?.province}, ` : ''}{billing?.country}</p>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-2">Enviar a</h2>
              <div className="text-sm text-gray-800 space-y-1">
                {shipping?.isDigital ? (
                  <p className="font-medium text-gray-600">Producto Digital</p>
                ) : (
                  <>
                    <p>{shipping?.name}</p>
                    <p>{shipping?.address}</p>
                    <p>{shipping?.postalCode} {shipping?.city}</p>
                    <p>{shipping?.province ? `${shipping?.province}, ` : ''}{shipping?.country}</p>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-bold text-gray-800 mb-2">Comerciante</h2>
              <div className="text-sm text-gray-800 space-y-1">
                <p className="font-bold">{issuer.name}</p>
                {issuer.tradeName && <p>{issuer.tradeName}</p>}
                <p>NIF/CIF: {issuer.taxId}</p>
                <p>{issuer.address}</p>
                <p>{issuer.postalCode} {issuer.city}</p>
                <p>{issuer.province ? `${issuer.province}, ` : ''}{issuer.country}</p>
                <p>{issuer.email}</p>
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
                {invoice.items?.map((item, i) => {
                  const vatRate = invoice.type === 'spain' ? (item.vatRate || 0) : 0;
                  let baseUnitPrice = parseFloat(item.unitPrice) || 0;
                  if (invoice.pricesIncludeVat) {
                    baseUnitPrice = baseUnitPrice / (1 + vatRate / 100);
                  }
                  
                  return (
                    <tr key={item.id || i} className="border-b border-gray-200">
                      <td className="py-3 px-2">{item.description}</td>
                      <td className="py-3 px-2 text-right">{item.quantity}</td>
                      <td className="py-3 px-2 text-right">{baseUnitPrice.toFixed(2)} €</td>
                      <td className="py-3 px-2 text-right">{vatRate} %</td>
                      <td className="py-3 px-2 text-right font-medium">{Number(item.total).toFixed(2)} €</td>
                    </tr>
                  );
                })}
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
                    <td className="py-2 text-gray-800 font-bold">Subtotal</td>
                    <td className="py-2 text-right text-gray-800">{Number(invoice.subtotal).toFixed(2)} €</td>
                  </tr>
                  {parseFloat(invoice.discount) > 0 && (
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-800 font-bold">Descuento</td>
                      <td className="py-2 text-right text-gray-800">-{Number(invoice.discount).toFixed(2)} €</td>
                    </tr>
                  )}
                  {invoice.type === 'spain' ? (
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-800 font-bold">IVA (21%)</td>
                      <td className="py-2 text-right text-gray-800">{Number(invoice.vatTotal).toFixed(2)} €</td>
                    </tr>
                  ) : null}
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-800 font-bold">Envío</td>
                    <td className="py-2 text-right text-gray-800">{
                      invoice.shipping?.cost > 0 
                        ? `${(invoice.pricesIncludeVat ? invoice.shipping.cost / (1 + (invoice.shipping.vatRate||0)/100) : invoice.shipping.cost).toFixed(2)} €`
                        : (invoice.shippingDetails?.isDigital ? '0.00 €' : '0.00 €')
                    }</td>
                  </tr>
                  {invoice.irpfTotal > 0 && (
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-800 font-bold">Retención IRPF ({invoice.irpfRate}%)</td>
                      <td className="py-2 text-right text-red-600">-{Number(invoice.irpfTotal).toFixed(2)} €</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-4 text-base font-bold text-gray-900">Total</td>
                    <td className="py-4 text-right text-base font-bold text-gray-900">{Number(invoice.total).toFixed(2)} €</td>
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
