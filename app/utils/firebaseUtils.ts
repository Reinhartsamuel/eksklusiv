/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';

import { authFirebase, db } from '../config/firebase';

// get Doc Firebase

export const getSingleDocumentFirebase = async (collectionName: string, docName: string): Promise<DocumentData | string | null | undefined> => {
  try {
    const docRef = doc(db, collectionName, docName,);
    const docSnapshot = await getDoc(docRef,);

    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      // Lakukan manipulasi data atau operasi lain jika diperlukan
      return { id: docSnapshot.id, ...docData, };
    } else {
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message + ':::  Failed to send  error message');
      return null
    }
  }
};

export const getCollectionFirebase = async (
  collectionName: string,
  conditions: { field: string; operator: '==' | '<' | '<=' | '>' | '>='; value: string }[] = [],
  sortBy: { field: string; direction: 'asc' | 'desc' } | null = null,
  limitValue: number | null = null,
  startAfterData: DocumentData | null = null
): Promise<any> => {
  try {
    const collectionRef: CollectionReference<DocumentData> = collection(db, collectionName);
    let queryRef: Query<DocumentData> = query(collectionRef); // Initialize queryRef with collectionRef

    // Add filter conditions if any
    if (conditions.length > 0) {
      conditions.forEach((condition) => {
        const { field, operator, value } = condition;
        queryRef = query(queryRef, where(field, operator, value)); // Update queryRef
      });
    }

    // Add sorting if any
    if (sortBy) {
      const { field, direction } = sortBy;
      queryRef = query(queryRef, orderBy(field, direction)); // Update queryRef
    }

    // Add limit if any
    if (limitValue) {
      queryRef = query(queryRef, limit(limitValue)); // Update queryRef
    }

    // Add startAfter if provided
    if (startAfterData) {
      queryRef = query(queryRef, startAfter(startAfterData)); // Update queryRef
    }

    const querySnapshot = await getDocs(queryRef); // Use queryRef for fetching documents
    const collectionData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      collectionData.push({ id: doc.id, ...docData });
    });

    return collectionData; // Return the collection data
  } catch (error) {
    // Ensure the error is of type Error
    if (error instanceof Error) {
      console.error(`Error fetching collection: ${error.message}`);
      throw new Error(error.message); // Rethrow the error for handling in the component
    }
    throw new Error('An unknown error occurred');
  }
};


export const setDocumentFirebase = async (
  collectionName: string,
  docName: string,
  data: DocumentData,
) => {
  try {
    if (data?.createdAt === undefined) {
      data.createdAt = new Date();
    }
    data.lastUpdated = new Date();
    if (authFirebase.currentUser) {
      data.lastUpdatedBy = {
        uid: authFirebase.currentUser.uid,
        email: authFirebase.currentUser.email,
      };
    }

    const docRef = doc(db, collectionName, docName,);
    await setDoc(docRef, data, { merge: true, },);

    // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
    return { message: 'Dokumen berhasil disimpan.', data: data, };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message + ' Failed to send  error message');
    }
  }
};

export const addDocumentFirebase = async (collectionName: string, data: DocumentData, companyId?: string) => {
  try {
    data.createdAt = new Date();
    data.lastUpdated = new Date();
    if (authFirebase?.currentUser) data.createdBy = authFirebase.currentUser.uid;
    if (companyId) data.companyId = companyId;

    const docRef = await addDoc(collection(db, collectionName,), data,);

    // Kembalikan ID dokumen yang baru dibuat
    return docRef.id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message + ' Failed to send  error message');
    }
  }
};

export const updateDocumentFirebase = async (collectionName: string, docName: string, data: DocumentData,) => {
  try {
    if (authFirebase.currentUser) {
      data.lastUpdatedBy = {
        uid: authFirebase.currentUser.uid,
        email: authFirebase.currentUser.email,
      };
    }
    data.lastUpdated = new Date();

    const docRef = doc(db, collectionName, docName,);
    await updateDoc(docRef, data,);

    // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
    return 'Dokumen berhasil diperbarui.';
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message + ' Failed to send  error message');
    }
  }
};


export const deleteDocumentFirebase = async (collectionName: string, docName: string,) => {
  try {
    const docRef = doc(db, collectionName, docName,);
    await deleteDoc(docRef,);

    // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
    return 'Dokumen berhasil dihapus.';
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message + ' Failed to send  error message');
    }
  }
};

export const arrayUnionFirebase = async (
  collectionName: string,
  docName: string,
  field: string,
  values: string[],
) => {
  try {
    const docRef = doc(db, collectionName, docName,);

    const updatedData = {
      [field]: arrayUnion(...values,),
    };

    await updateDoc(docRef, updatedData,);

    // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
    return 'Array berhasil diperbarui dengan nilai ditambahkan.'
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message + ' Failed to send  error message');
    }
  }
};

export const arrayRemoveFirebase = async (
  collectionName: string,
  docName: string,
  field: string,
  values: string[],
) => {
  try {
    const docRef = doc(db, collectionName, docName,);

    const updatedData = {
      [field]: arrayRemove(...values,),
    };

    await updateDoc(docRef, updatedData,);

    // Kembalikan pesan toast yang sesuai (bisa disesuaikan)
    return 'Array berhasil diperbarui dengan nilai dihapus.';
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message + ' Failed to send  error message');
    }
  }
};

export const countDocumentsFirebase = async (
  collectionName: string,
  conditions: { field: string; operator: '==' | '<' | '<=' | '>' | '>='; value: string }[] = [],
) => {
  try {
    let collectionRef: Query<DocumentData> = collection(db, collectionName);
  
    // Add conditions if any
    if (conditions.length > 0) {
      conditions.forEach((condition) => {
        const { field, operator, value } = condition;
        collectionRef = query(collectionRef, where(field, operator, value));
      });
    }
  
    const countQuery = await getCountFromServer(collectionRef);
    return countQuery.data().count; // Return the count of documents in the collection
  } catch (error) {
    // Ensure the error is of type Error
    if (error instanceof Error) {
      console.error(`Error fetching collection: ${error.message}`);
      throw new Error(error.message); // Rethrow the error for handling in the component
    }
    throw new Error('An unknown error occurred');
  }
};
