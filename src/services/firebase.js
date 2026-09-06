import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAI, getGenerativeModel, GoogleAIBackend, Schema } from 'firebase/ai';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: "AIzaSyDE7fAVSrQjGgw0A-tQHTSIlQ9GhWPXDb4",
  authDomain: "facturairez.firebaseapp.com",
  projectId: "facturairez",
  storageBucket: "facturairez.firebasestorage.app",
  messagingSenderId: "1038348786162",
  appId: "1:1038348786162:web:a0a44ff998bdbd059df36b"
};

const app = initializeApp(firebaseConfig);

if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6Lfn9KwtAAAAAAsyswbQXh31QUYSkpEAVeIloDee'),
  isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const ai = getAI(app, { backend: new GoogleAIBackend() });

const invoiceSchema = Schema.object({
  properties: {
    orderNumber: Schema.string({ nullable: true }),
    client: Schema.object({
      properties: {
        name: Schema.string(),
        taxId: Schema.string({ nullable: true }),
        address: Schema.string(),
        postalCode: Schema.string(),
        city: Schema.string(),
        province: Schema.string(),
        country: Schema.string(),
        email: Schema.string({ nullable: true })
      }
    }),
    items: Schema.array({
      items: Schema.object({
        properties: {
          description: Schema.string(),
          quantity: Schema.number(),
          unitPrice: Schema.number(),
          vatRate: Schema.number()
        }
      })
    }),
    shipping: Schema.object({
      properties: {
        cost: Schema.number(),
        vatRate: Schema.number()
      }
    })
  }
});

export const ocrModel = getGenerativeModel(ai, {
  model: 'gemini-3.6-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: invoiceSchema,
    temperature: 0.1
  }
});

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
