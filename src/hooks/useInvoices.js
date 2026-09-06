import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export const useInvoices = (type) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'invoices'),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setInvoices(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching invoices:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, type]);

  const addInvoice = async (invoiceData) => {
    if (!user) throw new Error("No user authenticated");
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'invoices'), {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error("Error adding invoice:", err);
      throw err;
    }
  };

  const updateInvoice = async (id, invoiceData) => {
    if (!user) throw new Error("No user authenticated");
    try {
      const docRef = doc(db, 'users', user.uid, 'invoices', id);
      await updateDoc(docRef, {
        ...invoiceData,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error updating invoice:", err);
      throw err;
    }
  };

  const deleteInvoice = async (id) => {
    if (!user) throw new Error("No user authenticated");
    try {
      const docRef = doc(db, 'users', user.uid, 'invoices', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting invoice:", err);
      throw err;
    }
  };

  return { invoices, loading, error, addInvoice, updateInvoice, deleteInvoice };
};
