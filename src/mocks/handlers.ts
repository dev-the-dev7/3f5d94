import { http, HttpResponse } from 'msw';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = 'avantos-mappings';

// Get/set from localStorage
function loadMappings(): any[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMappings(data: any[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// MSW handlers for managing mappings
export const handlers = [
  http.get(`${API_BASE}/mappings`, () => {
    const stored = loadMappings();
    return HttpResponse.json(stored);
  }),

  http.post(`${API_BASE}/mappings`, async ({ request }) => {
    const body = await request.json() as any[];;
    saveMappings(body);
    console.log('MSW received and saved mappings:', body);
    return HttpResponse.json({ success: true });
  }),
];
