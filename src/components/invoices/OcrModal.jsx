import React, { useState } from 'react';
import { X, FileText, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { ocrModel } from '../../services/firebase';
import { format } from 'date-fns';

const OcrModal = ({ isOpen, onClose, onDataExtracted }) => {
  const [type, setType] = useState('spain');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError('');
    } else {
      setFile(null);
      setPreviewUrl(null);
      setError('Por favor, selecciona un archivo PDF válido.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError('');
    } else {
      setError('Por favor, selecciona un archivo PDF válido.');
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Debes subir un archivo PDF para procesar.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const base64Data = await fileToBase64(file);
      
      const prompt = `Analiza este documento PDF de pedido/factura y extrae los datos requeridos en formato JSON estructurado. 
      Instrucciones importantes:
      1. Extrae el número de pedido (orderNumber) si aparece.
      2. Extrae los datos del cliente: nombre, dirección, código postal, ciudad, país. Extrae el NIF/CIF si existe.
      3. Extrae todos los artículos comprados (description, quantity, unitPrice). El vatRate configúralo a ${type === 'spain' ? '21' : '0'}.
      4. Extrae los gastos de envío (shipping cost) si existen.
      Devuelve un JSON estrictamente basado en el esquema configurado.`;

      const result = await ocrModel.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: 'application/pdf'
          }
        }
      ]);
      
      const responseText = result.response.text();
      const extractedData = JSON.parse(responseText);

      // Pre-fill some default structure required by our InvoiceModal
      const structuredData = {
        type,
        invoiceNumber: '',
        orderNumber: extractedData.orderNumber || '',
        issueDate: format(new Date(), 'yyyy-MM-dd'),
        supplyDate: format(new Date(), 'yyyy-MM-dd'),
        client: {
          name: extractedData.client?.name || '',
          taxId: extractedData.client?.taxId || '',
          address: extractedData.client?.address || '',
          postalCode: extractedData.client?.postalCode || '',
          city: extractedData.client?.city || '',
          province: extractedData.client?.province || '',
          country: extractedData.client?.country || '',
          email: extractedData.client?.email || ''
        },
        items: (extractedData.items || []).map((item, index) => ({
          id: Date.now().toString() + index,
          description: item.description || '',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          vatRate: item.vatRate !== undefined ? item.vatRate : (type === 'spain' ? 21 : 0),
          total: (item.quantity || 1) * (item.unitPrice || 0)
        })),
        shipping: {
          cost: extractedData.shipping?.cost || 0,
          vatRate: extractedData.shipping?.vatRate !== undefined ? extractedData.shipping?.vatRate : (type === 'spain' ? 21 : 0)
        }
      };

      onDataExtracted(structuredData);
      
    } catch (err) {
      console.error('Error durante la extracción OCR:', err);
      setError('Hubo un error procesando el documento. Asegúrate de haber habilitado AI Logic en tu proyecto Firebase o prueba con otro documento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-600/75 transition-opacity" onClick={onClose}></div>
      
      {/* Modal Panel */}
      <div className="relative bg-white rounded-lg text-left shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-medium text-gray-900 flex items-center" id="modal-title">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Nueva Factura OCR (Automática)
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-8 h-full">
            
            {/* Controles y subida (Izquierda) */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Factura</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={loading}
                >
                  <option value="spain">España</option>
                  <option value="europe">Europa (Intracomunitaria)</option>
                  <option value="world">Resto del Mundo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subir Documento (PDF)</label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                    file ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Sube un archivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} disabled={loading} />
                      </label>
                      <p className="pl-1">o arrástralo y suéltalo aquí</p>
                    </div>
                    <p className="text-xs text-gray-500">Solo archivos PDF</p>
                    
                    {file && (
                      <div className="mt-3 text-sm font-medium text-blue-700 break-all">
                        Seleccionado: {file.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!file || loading}
                  className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !file || loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Procesando documento con IA...
                    </>
                  ) : (
                    'Extraer datos con IA'
                  )}
                </button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  El proceso puede tardar unos segundos dependiendo del tamaño del documento.
                </p>
              </div>
            </div>

            {/* Previsualización (Derecha) */}
            <div className="w-full md:w-2/3 border border-gray-200 rounded-lg overflow-hidden bg-gray-100 flex flex-col min-h-[400px]">
              <div className="bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                Previsualización del PDF
              </div>
              <div className="flex-1 w-full h-full relative">
                {previewUrl ? (
                  <iframe 
                    src={previewUrl} 
                    className="absolute inset-0 w-full h-full border-0"
                    title="Previsualización PDF"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                    <FileText className="h-16 w-16 mb-4 text-gray-300" />
                    <p>Sube un archivo PDF en el panel izquierdo para previsualizarlo aquí.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OcrModal;
