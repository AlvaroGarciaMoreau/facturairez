import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const invoiceSchema = {
  type: SchemaType.OBJECT,
  properties: {
    orderNumber: { type: SchemaType.STRING, nullable: true },
    client: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING },
        taxId: { type: SchemaType.STRING, nullable: true },
        address: { type: SchemaType.STRING },
        postalCode: { type: SchemaType.STRING },
        city: { type: SchemaType.STRING },
        province: { type: SchemaType.STRING },
        country: { type: SchemaType.STRING },
        email: { type: SchemaType.STRING, nullable: true }
      }
    },
    items: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          description: { type: SchemaType.STRING },
          quantity: { type: SchemaType.NUMBER },
          unitPrice: { type: SchemaType.NUMBER },
          vatRate: { type: SchemaType.NUMBER }
        }
      }
    },
    shipping: {
      type: SchemaType.OBJECT,
      properties: {
        cost: { type: SchemaType.NUMBER },
        vatRate: { type: SchemaType.NUMBER }
      }
    }
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
