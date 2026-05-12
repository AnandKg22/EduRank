import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * useRealtimeData — Generic hook for subscribing to Supabase Postgres Changes.
 * Manages the full subscription lifecycle with automatic cleanup.
 *
 * @param {string} table - Table name to listen to
 * @param {object} options - { select, filter, orderBy, ascending, event }
 * @returns {{ data: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export default function useRealtimeData(table, options = {}) {
  const {
    select = '*',
    filter = null,  // { column: 'user_id', value: '...' }
    orderBy = null, // { column: 'created_at', ascending: false }
    event = '*',    // INSERT | UPDATE | DELETE | *
    limit = null,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Build a stable filter key for dependency tracking
  const filterKey = filter ? `${filter.column}:${filter.value}` : 'none';
  const orderKey = orderBy ? `${orderBy.column}:${orderBy.ascending}` : 'none';

  const fetchData = useCallback(async () => {
    setLoading(true);
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
      console.error(`useRealtimeData [${table}]:`, err);
    } finally {
      setLoading(false);
    }
  }, [table, select, filterKey, orderKey, limit]);

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
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

  return { data, loading, error, refetch: fetchData };
}
