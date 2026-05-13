import { supabase } from './supabase';

/**
 * Standardized Response Envelope Utility
 * Enforces Strategy/07-api/RESPONSE-FORMATS.md JSON wrapper contract.
 */
export const createApiResponse = (success, data = null, error = null) => ({
  success,
  data,
  error: error ? (typeof error === 'string' ? { message: error, code: 'UNKNOWN' } : error) : null,
  timestamp: new Date().toISOString(),
});

/**
 * Securely invokes a Supabase Edge Function adhering to standard API boundaries.
 * @param {string} functionName - Target edge function identifier.
 * @param {object} payload - Request JSON body mapped in snake_case.
 */
export const invokeEdgeFunction = async (functionName, payload = {}) => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
    });

    if (error) {
      console.error(`Edge Function execution failure [${functionName}]:`, error);
      return createApiResponse(false, null, {
        message: error.message || 'Server execution failure.',
        status: error.status || 500,
      });
    }

    return createApiResponse(true, data);
  } catch (err) {
    console.error(`Network error invoking [${functionName}]:`, err);
    return createApiResponse(false, null, {
      message: err.message || 'Network communication interruption.',
      status: 0,
    });
  }
};

/**
 * Global Query Handler wrapping database selects with error logging.
 */
export const executeQuery = async (queryPromise) => {
  try {
    const { data, error } = await queryPromise;
    if (error) {
      console.error('Database query operation failure:', error);
      return createApiResponse(false, null, error);
    }
    return createApiResponse(true, data);
  } catch (err) {
    console.error('Unhandled execution exception during database interaction:', err);
    return createApiResponse(false, null, err.message);
  }
};
