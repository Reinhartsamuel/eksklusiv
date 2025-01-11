'use client';
import { useState, useEffect } from 'react';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { authFirebase, db } from '../config/firebase';
import { getCollectionFirebase } from '../utils/firebaseUtils';

// Define the types for the parameters
interface Condition {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
  value: any;
}

interface UseFetchDataProps {
  type?: 'getDocs' | 'onSnapshot';
  limitQuery?: number;
  collectionName?: string;
  conditions?: Condition[];
  dependencies?: any[];
  authRequired?: boolean;
}

// Define the return type of the hook
interface UseFetchDataReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  fetchData: () => Promise<void>;
}

const useFetchData = <T>({
  type = 'getDocs',
  limitQuery = 5,
  collectionName = 'webhooks',
  conditions = [],
  dependencies = [],
  authRequired = true,
}: UseFetchDataProps): UseFetchDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastVisible, setLastVisible] = useState<any>({});

  const fetchData = async () => {
    if (authRequired && !authFirebase.currentUser?.email) {
      return;
    }
    setLoading(true);
    try {
      const response = await getCollectionFirebase(
        collectionName,
        conditions,
        { field: 'createdAt', direction: 'desc' },
        limitQuery
      );
      setData(response);
      setHasMore(response.length === limitQuery);
      setLastVisible(response[response.length - 1]);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribe = () => { };
    if (type === 'getDocs') {
      fetchData();
    } else if (type === 'onSnapshot') {
      setLoading(true);
      const colRef = collection(db, collectionName);
      const queryLimit = 10;

      const createQueryWithConditions = (colRef: any, conditions: Condition[], queryLimit: number) => {
        let firestoreQuery = query(colRef, orderBy('createdAt', 'desc'));

        conditions.forEach((cond) => {
          firestoreQuery = query(
            firestoreQuery,
            where(cond.field, cond.operator, cond.value)
          );
        });

        firestoreQuery = query(firestoreQuery, limit(queryLimit));

        return firestoreQuery;
      };

      const firestoreQuery = createQueryWithConditions(
        colRef,
        conditions,
        queryLimit
      );
      unsubscribe = onSnapshot(firestoreQuery, (querySnapshot) => {
        const arr: T[] = [];
        querySnapshot.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(arr);
      });
      setLoading(false);
      return () => unsubscribe();
    }
  }, [...dependencies]);

  const loadMore = async () => {
    if (hasMore) {
      try {
        const res = await getCollectionFirebase(
          collectionName,
          [],
          { field: 'createdAt', direction: 'desc' },
          5,
          lastVisible.createdAt
        );
        const newData = [...data, ...res];
        setData(newData);
        setLastVisible(newData[newData.length - 1]);
      } catch (error) {
        Swal.fire({
          title: 'error',
          text: (error as Error).message,
          icon: 'error',
        });
      }
    }
  };

  return { data, loading, error, loadMore, fetchData };
};

export default useFetchData;