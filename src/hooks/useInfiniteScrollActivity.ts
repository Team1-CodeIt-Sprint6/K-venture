import { useCallback, useEffect, useRef, useState } from 'react';

import { getActivities } from '@/lib/apis/getApis';
import { MyActivity } from '@/types/get/activityTypes';

const useInfiniteScrollActivity = () => {
  const [activities, setActivities] = useState<MyActivity[]>([]);
  const [nextCursorId, setNextCursorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const fetchActivitiesData = useCallback(
    async (isReset: boolean = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      try {
        const data = await getActivities(isReset ? null : nextCursorId);
        setActivities((prev) =>
          isReset ? data.activities : [...prev, ...data.activities],
        );
        setNextCursorId(data.cursorId);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        loadingRef.current = false;
      }
    },
    [nextCursorId],
  );

  const handleScroll = useCallback(() => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - 100;

    if (scrollPosition >= threshold && !loadingRef.current && nextCursorId) {
      fetchActivitiesData();
    }
  }, [fetchActivitiesData, nextCursorId]);

  useEffect(() => {
    fetchActivitiesData(true);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    activities,
    loading: loadingRef.current,
    error,
    setError,
    fetchActivitiesData,
  };
};

export default useInfiniteScrollActivity;
