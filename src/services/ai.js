import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const invoiceSchema = {
  type: SchemaType.OBJECT,
  properties: {
    orderNumber: { type: SchemaType.STRING, nullable: true },
    invoiceNumber: { type: SchemaType.STRING, nullable: true },
    date: { type: SchemaType.STRING, nullable: true },
    shippingDetails: {
      type: SchemaType.OBJECT,
      nullable: true,
      properties: {
        name: { type: SchemaType.STRING, nullable: true },
        address: { type: SchemaType.STRING, nullable: true },
        postalCode: { type: SchemaType.STRING, nullable: true },
        city: { type: SchemaType.STRING, nullable: true },
        province: { type: SchemaType.STRING, nullable: true },
        country: { type: SchemaType.STRING, nullable: true }
      }
    },
    billingDetails: {
      type: SchemaType.OBJECT,
      nullable: true,
      properties: {
        name: { type: SchemaType.STRING, nullable: true },
        taxId: { type: SchemaType.STRING, nullable: true },
        address: { type: SchemaType.STRING, nullable: true },
        postalCode: { type: SchemaType.STRING, nullable: true },
        city: { type: SchemaType.STRING, nullable: true },
        province: { type: SchemaType.STRING, nullable: true },
        country: { type: SchemaType.STRING, nullable: true }
      }
    },
    sameAsShipping: { type: SchemaType.BOOLEAN, nullable: true },
    items: {
      type: SchemaType.ARRAY,
      nullable: true,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          description: { type: SchemaType.STRING, nullable: true },
          quantity: { type: SchemaType.NUMBER, nullable: true },
          unitPrice: { type: SchemaType.NUMBER, nullable: true },
          vatRate: { type: SchemaType.NUMBER, nullable: true }
        }
      }
    },
    shippingCost: { type: SchemaType.NUMBER, nullable: true },
    globalVatRate: { type: SchemaType.NUMBER, nullable: true },
    discount: { type: SchemaType.NUMBER, nullable: true }
  }
};

export const ocrModel = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash', // Usa el modelo configurado
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: invoiceSchema,
    temperature: 0.1
  }
});
