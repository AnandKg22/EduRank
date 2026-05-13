import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

/**
 * Enterprise Realtime Postgres Changes Hook
 * Implements persistent background state syncing scoped by B2B/RLS parameters.
 *
 * @param {string} table - Postgres entity schema name.
 * @param {object} options - Configuration overrides.
 */
export const useRealtimeData = (table, options = {}) => {
  const {
    select = '*',
    filter = null,  
    orderBy = null, 
    event = '*',    
    limit = null,
  } = options;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = filter ? `${filter.column}:${filter.value}` : 'none';
  const orderKey = orderBy ? `${orderBy.column}:${orderBy.ascending}` : 'none';

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase.from(table).select(select);

      if (filter) {
        query = query.eq(filter.column, filter.value);
      }
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      }
      if (limit) {
        query = query.limit(limit);
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setData(result || []);
    } catch (err) {
      setError(err);
      console.error(`useRealtimeData failure [${table}]:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [table, select, filterKey, orderKey, limit]);

  useEffect(() => {
    fetchData();

    const channelName = `realtime-${table}-${filterKey}-${Date.now()}`;
    const channelFilter = filter
      ? `${filter.column}=eq.${filter.value}`
      : undefined;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          ...(channelFilter ? { filter: channelFilter } : {}),
        },
        (payload) => {
          setData((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [payload.new, ...prev];
              case 'UPDATE':
                return prev.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                );
              case 'DELETE':
                return prev.filter((item) => item.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, fetchData, event, filterKey]);

  return { data, isLoading, loading: isLoading, error, refetch: fetchData };
};

export default useRealtimeData;
