/**
 * API service layer — placeholder for future real data fetching.
 * When Flutter JS bridges or REST APIs are ready, implement actual
 * fetch calls here without changing any UI component imports.
 */

export const api = {
  baseUrl: '', // Will be set by Flutter JS bridge or env var

  /**
   * Generic GET request placeholder
   */
  async get<T>(_endpoint: string): Promise<T> {
    // Future: return fetch(`${this.baseUrl}${endpoint}`).then(r => r.json());
    throw new Error('API not yet connected. Using mock data.');
  },

  /**
   * Generic POST request placeholder
   */
  async post<T>(_endpoint: string, _body: unknown): Promise<T> {
    throw new Error('API not yet connected. Using mock data.');
  },
};
