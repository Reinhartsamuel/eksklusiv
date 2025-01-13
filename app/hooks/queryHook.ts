/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, CollectionReference, DocumentData, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getCollectionFirebase } from '../utils/firebaseUtils';
import { db } from '../config/firebase';


interface UseFetchDataProps {
    type?: 'getDocs' | 'onSnapshot';
    limitQuery?: number;
    collectionName?: string;
    conditions?: { field: string; operator: '==' | '<' | '<=' | '>' | '>='; value: string }[];
    defaultLastVisible?: any;
}

const useFetchData = ({
    type = 'getDocs',
    limitQuery = 5,
    collectionName = 'webhooks',
    conditions = [],
    defaultLastVisible = null,
}: UseFetchDataProps) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [lastVisible, setLastVisible] = useState<DocumentData>({});

    const fetchData = async () => {
        setLoading(true);
        console.log('fetching...');
        try {
            const response = await getCollectionFirebase(
                collectionName,
                conditions,
                { field: 'createdAt', direction: 'desc' },
                limitQuery
            );
            setData(response);
            setLastVisible(response[response.length - 1]);
        } catch (error) {
            setError((error as Error));
            console.log((error as Error).message, 'error for conditions:', conditions);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        let unsubscribe = () => { };
        if (type === 'getDocs') {
            fetchData();
        } else {
            // console.log('type is onSnapshot');
            const colRef = collection(db, collectionName);
            const queryLimit = 10; // Set your desired limit here

            const createQueryWithConditions = (
                colRef: CollectionReference<DocumentData>,
                conditions: { field: string; operator: '==' | '<' | '<=' | '>' | '>='; value: string }[],
                queryLimit: number = 10) => {
                let firestoreQuery = query(colRef, orderBy('createdAt', 'desc'));

                // Apply each condition using `where()`
                conditions.forEach((cond) => {
                    firestoreQuery = query(
                        firestoreQuery,
                        where(cond.field, cond.operator, cond.value)
                    );
                });

                // Apply the limit
                firestoreQuery = query(firestoreQuery, limit(queryLimit));

                return firestoreQuery;
            };

            // Create the query using the conditions and the limit
            const firestoreQuery = createQueryWithConditions(
                colRef,
                conditions,
                queryLimit
            );
            unsubscribe = onSnapshot(firestoreQuery, (querySnapshot) => {
                const arr: any[] = [];
                querySnapshot.forEach((doc) => {
                    arr.push({ id: doc.id, ...doc.data() });
                });
                setData(arr);
            });
            setLoading(false);
        }

        return () => unsubscribe();
    }, []);

    const loadMore = async () => {
        setIsFetchingMore(true);
        if (!lastVisible?.createdAt) return setIsFetchingMore(false);
        
        try {
            const res = await getCollectionFirebase(
                collectionName,
                [],
                { field: 'createdAt', direction: 'desc' },
                limitQuery,
                defaultLastVisible ? defaultLastVisible.createdAt : lastVisible.createdAt
            );
            const newData = [...data, ...res];
            setData(newData);
            setLastVisible(newData[newData.length - 1]);
        } catch (error) {
            console.log((error as Error).message, '::error load more, conditions:', conditions);

        } finally {
            setIsFetchingMore(false)
        }
    };

    return { data, loading, error, loadMore, fetchData, isFetchingMore };
};

export default useFetchData;