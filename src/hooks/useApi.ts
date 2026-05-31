import { useState, useCallback } from 'react';

/**
 * Fire-and-forget API request helper used outside React components.
 *
 * Resolves to the `data` field of the standard `{ success, data }` envelope,
 * or throws an Error with a readable message on any failure (network, HTTP 4xx/5xx,
 * or a business-logic error returned by the API).
 */
export async function apiRequest(path: string, options: RequestInit = {}) {
  let res: Response;
  try {
    res = await fetch(path, options);
  } catch {
    throw new Error('Network error — check your connection');
  }

  let json: Record<string, unknown> | null = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Server returned ${res.status} with a non-JSON body`);
  }

  if (json && typeof json === 'object') {
    if ('success' in json) {
      if (!json.success) {
        throw new Error((json.error as string | undefined) ?? `Request failed (${res.status})`);
      }
      return json.data;
    }
  }

  // Fallback: non-envelope response (should not occur with current API routes)
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return json;
}

/**
 * React hook wrapping `apiRequest` with loading / error state.
 * Use `request()` inside components; use `apiRequest()` directly in utilities.
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (path: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(path, options);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}
