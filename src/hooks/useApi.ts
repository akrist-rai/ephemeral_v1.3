import { useState, useCallback } from 'react';

/**
 * Raw API request function.
 * Handles the new response envelope: { success, data, meta, error }
 */
export async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(path, options);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.error || `Request failed: ${res.status}`);
  }

  if (json?.success === false) {
    throw new Error(json?.error || 'Unknown API error');
  }

  // The new envelope wraps data in { success, data: { ... } }
  // Fall back to the whole response for backwards compatibility
  return json?.data ?? json;
}

/**
 * React hook wrapping apiRequest with loading/error state.
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (path: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest(path, options);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}
