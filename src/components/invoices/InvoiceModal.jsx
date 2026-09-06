import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const defaultIssuer = {
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

const emptyClient = { name: '', taxId: '', address: '', postalCode: '', city: '', province: '', country: '', email: '' };

const InvoiceModal = ({ isOpen, onClose, onSave, initialData, currentType }) => {
  const [formData, setFormData] = useState({
    type: currentType || 'spain',
    invoiceNumber: '',
    orderNumber: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    supplyDate: format(new Date(), 'yyyy-MM-dd'),
    issuer: { ...defaultIssuer },
    client: { ...emptyClient },
    items: [],
    shipping: { cost: 0, vatRate: 21 },
    irpfRate: 0,
    status: 'issued',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(prev => ({ ...prev, type: currentType || 'spain' }));
    }
  }, [initialData, currentType]);

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    const valNum = parseFloat(value) || 0;
    
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto calculate line total
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? valNum : parseFloat(newItems[index].quantity) || 0;
      const price = field === 'unitPrice' ? valNum : parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = qty * price;
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, vatRate: prev.type === 'spain' ? 21 : 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let vatTotal = 0;
    
    formData.items.forEach(item => {
      subtotal += item.total;
      vatTotal += item.total * ((parseFloat(item.vatRate) || 0) / 100);
    });

    const shippingCost = parseFloat(formData.shipping.cost) || 0;
    if (shippingCost > 0) {
      subtotal += shippingCost;
      vatTotal += shippingCost * ((parseFloat(formData.shipping.vatRate) || 0) / 100);
    }

    const irpfTotal = subtotal * ((parseFloat(formData.irpfRate) || 0) / 100);
    const total = subtotal + vatTotal - irpfTotal;

    return { subtotal, vatTotal, irpfTotal, total };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totals = calculateTotals();
    onSave({ ...formData, ...totals });
  };

  const totals = calculateTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-600/75 transition-opacity" onClick={onClose}></div>
      
      {/* Modal Panel */}
      <div className="relative bg-white rounded-lg text-left shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl leading-6 font-medium text-gray-900" id="modal-title">
                  {initialData ? 'Editar Factura' : 'Nueva Factura'}
                </h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Factura</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="spain">España</option>
                    <option value="europe">Europa (Intracomunitaria)</option>
                    <option value="world">Resto del Mundo</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Número de Factura</label>
                  <input type="text" required name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Número de Pedido</label>
                  <input type="text" name="orderNumber" value={formData.orderNumber || ''} onChange={handleChange} placeholder="Opcional" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="draft">Borrador</option>
                    <option value="issued">Emitida</option>
                    <option value="paid">Pagada</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Fecha de Emisión</label>
                  <input type="date" required name="issueDate" value={formData.issueDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Fecha de Operación</label>
                  <input type="date" required name="supplyDate" value={formData.supplyDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Datos del Cliente</h4>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Nombre / Razón Social</label>
                    <input type="text" required name="name" value={formData.client.name} onChange={(e) => handleChange(e, 'client')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">NIF / CIF / VAT ID</label>
                    <input type="text" name="taxId" value={formData.client.taxId} onChange={(e) => handleChange(e, 'client')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input type="text" required name="address" value={formData.client.address} onChange={(e) => handleChange(e, 'client')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                    <input type="text" required name="postalCode" value={formData.client.postalCode} onChange={(e) => handleChange(e, 'client')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <input type="text" required name="city" value={formData.client.city} onChange={(e) => handleChange(e, 'client')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">País</label>
                    <input type="text" required name="country" value={formData.client.country} onChange={(e) => handleChange(e, 'client')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Conceptos</h4>
                  <button type="button" onClick={addItem} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none">
                    <Plus className="h-4 w-4 mr-1" /> Añadir línea
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={item.id} className="flex flex-wrap items-end gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-medium text-gray-500">Descripción</label>
                        <input type="text" required value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                      </div>
                      <div className="w-20">
                        <label className="block text-xs font-medium text-gray-500">Cant.</label>
                        <input type="number" required min="1" step="any" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-medium text-gray-500">Precio</label>
                        <input type="number" required min="0" step="0.01" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                      </div>
                      <div className="w-20">
                        <label className="block text-xs font-medium text-gray-500">IVA (%)</label>
                        <input type="number" min="0" max="100" value={item.vatRate} onChange={(e) => handleItemChange(index, 'vatRate', e.target.value)} disabled={formData.type !== 'spain'} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 bg-white disabled:bg-gray-100 sm:text-sm" />
                      </div>
                      <div className="w-24 pt-2 text-right">
                        <span className="text-sm font-medium text-gray-900">€{item.total.toFixed(2)}</span>
                      </div>
                      <div className="w-10 text-right">
                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {formData.items.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No hay conceptos añadidos.</p>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Coste de Envío</label>
                      <div className="flex space-x-2 mt-1">
                        <input type="number" min="0" step="0.01" value={formData.shipping.cost} onChange={(e) => handleChange({ target: { name: 'cost', value: e.target.value } }, 'shipping')} className="block w-32 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" placeholder="Coste" />
                        <input type="number" min="0" max="100" value={formData.shipping.vatRate} onChange={(e) => handleChange({ target: { name: 'vatRate', value: e.target.value } }, 'shipping')} disabled={formData.type !== 'spain'} className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm disabled:bg-gray-100" placeholder="IVA %" />
                      </div>
                    </div>
                    {formData.type === 'spain' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Retención IRPF (%)</label>
                        <input type="number" min="0" max="100" name="irpfRate" value={formData.irpfRate} onChange={handleChange} className="mt-1 block w-32 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notas / Comentarios (opcional)</label>
                      <textarea name="notes" rows={2} value={formData.notes} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                    </div>
                  </div>

                  <div className="w-full md:w-64 bg-gray-50 p-4 rounded-md">
                    <dl className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <dt>Subtotal</dt>
                        <dd className="font-medium">€{totals.subtotal.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>IVA Total</dt>
                        <dd className="font-medium">€{totals.vatTotal.toFixed(2)}</dd>
                      </div>
                      {totals.irpfTotal > 0 && (
                        <div className="flex justify-between text-red-600">
                          <dt>Retención IRPF</dt>
                          <dd className="font-medium">-€{totals.irpfTotal.toFixed(2)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-bold text-gray-900">
                        <dt>Total</dt>
                        <dd>€{totals.total.toFixed(2)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                {initialData ? 'Actualizar Factura' : 'Guardar Factura'}
              </button>
              <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
