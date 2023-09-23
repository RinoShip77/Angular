export function formatFilterURL(baseURL: string, context: string, filter: number[]) {
  baseURL += context + '=';

  for (let i = 0; i < filter.length; i++) {
    baseURL += + filter[i] + ',';
  }

  return baseURL.slice(0, -1);
}

export const urlServer = 'https://localhost:8000/';