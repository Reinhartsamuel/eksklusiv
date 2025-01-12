import { useEffect, useState } from 'react';
import { countDocumentsFirebase } from '../utils/firebaseUtils';

const useCountDocuments = ({
  collectionName = 'customers',
  conditions = [],
} : {
  collectionName?: string;
  conditions?: { field: string; operator: '==' | '<' | '<=' | '>' | '>='; value: string }[]
}) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCount = async () => {
      setLoading(true);
      try {
        const response = await countDocumentsFirebase(
          collectionName,
          conditions
        );
        setCount(response || 0);
      } catch (error) {
        console.error((error as Error).message, 'collectionName', collectionName);
      } finally {
        setLoading(false);
      }
    };
    getCount();

    return () => setCount(0);
  }, []);

  return { count, loading };
};

export default useCountDocuments;
