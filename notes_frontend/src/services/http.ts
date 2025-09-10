/**
 * HTTP client wrapper built on top of the Fetch API.
 *
 * - It reads the base URL from VITE_API_BASE_URL environment variable.
 * - Adds JSON headers by default and serializes/deserializes JSON bodies.
 * - Provides typed methods: get, post, put, del.
 * - Centralized error handling with descriptive Error objects.
 *
 * Notes API contract (to be consumed by this frontend):
 * - GET    /api/notes           -> List notes
 * - GET    /api/notes/:id       -> Get a single note
 * - POST   /api/notes           -> Create a note (expects JSON body)
 * - PUT    /api/notes/:id       -> Update a note (expects JSON body)
 * - DELETE /api/notes/:id       -> Delete a note
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!BASE_URL) {
  // Provide an early, clear signal if configuration is missing.
  // The app should rely on .env or .env.development to define VITE_API_BASE_URL.
  // See README or deployment docs for proper values per environment.
  console.warn(
    '[http] VITE_API_BASE_URL is not defined. Requests will likely fail. Please set it in .env files.'
  );
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpErrorPayload {
  status: number;
  statusText: string;
  url: string;
  method: HttpMethod;
  body?: unknown;
  response?: unknown;
}

export class HttpError extends Error {
  status: number;
  url: string;
  method: HttpMethod;
  response?: unknown;
  requestBody?: unknown;

  constructor(message: string, payload: HttpErrorPayload) {
    super(message);
    this.name = 'HttpError';
    this.status = payload.status;
    this.url = payload.url;
    this.method = payload.method;
    this.response = payload.response;
    this.requestBody = payload.body;
  }
}

/**
 * Build a fully-qualified URL using the configured BASE_URL and a path.
 * Handles leading/trailing slashes to avoid double or missing slashes.
 */
function buildUrl(path: string): string {
  const base = (BASE_URL ?? '').replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  return `${base}/${p}`;
}

/**
 * Core request function to handle fetch calls consistently.
 */
async function request<T>(
  method: HttpMethod,
  path: string,
  data?: unknown,
  init?: RequestInit
): Promise<T> {
  const url = buildUrl(path);

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(data ? { 'Content-Type': 'application/json' } : {}),
    ...(init?.headers ?? {}),
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // adjust if backend doesn't use cookies
    ...init,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  let response: Response;

  try {
    response = await fetch(url, config);
  } catch {
    throw new HttpError('Network error while calling API', {
      status: 0,
      statusText: 'NETWORK_ERROR',
      url,
      method,
      body: data,
      response: undefined,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let parsedBody: unknown = undefined;
  try {
    parsedBody = isJson ? await response.json() : await response.text();
  } catch {
    // If parsing fails, keep parsedBody undefined; some endpoints may return empty bodies.
    parsedBody = undefined;
  }

  if (!response.ok) {
    // Try to extract message from JSON error payload if available
    const messageFromServer =
      isJson && parsedBody && typeof parsedBody === 'object' && 'message' in parsedBody
        ? String((parsedBody as Record<string, unknown>).message)
        : undefined;

    const message =
      messageFromServer ||
      `HTTP ${response.status} ${response.statusText || ''}`.trim() ||
      'Request failed';

    throw new HttpError(message, {
      status: response.status,
      statusText: response.statusText,
      url,
      method,
      body: data,
      response: parsedBody,
    });
  }

  // Cast to expected generic type
  return parsedBody as T;
}

// PUBLIC_INTERFACE
export const http = {
  /** Perform a GET request. */
  // PUBLIC_INTERFACE
  get<T>(path: string, init?: RequestInit) {
    /** Perform a GET request to the provided path. */
    return request<T>('GET', path, undefined, init);
  },

  /** Perform a POST request with JSON body. */
  // PUBLIC_INTERFACE
  post<T>(path: string, data?: unknown, init?: RequestInit) {
    /** Perform a POST request to the provided path with optional JSON body. */
    return request<T>('POST', path, data, init);
  },

  /** Perform a PUT request with JSON body. */
  // PUBLIC_INTERFACE
  put<T>(path: string, data?: unknown, init?: RequestInit) {
    /** Perform a PUT request to the provided path with optional JSON body. */
    return request<T>('PUT', path, data, init);
  },

  /** Perform a DELETE request. */
  // PUBLIC_INTERFACE
  del<T>(path: string, init?: RequestInit) {
    /** Perform a DELETE request to the provided path. */
    return request<T>('DELETE', path, undefined, init);
  },
};

export default http;
